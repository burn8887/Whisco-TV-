#!/usr/bin/env python3
"""Salim camera-report API and human moderation queue.

Reference deployment: a single service behind HTTPS with a persistent SQLite volume.
Never expose SQLite on an ephemeral/serverless filesystem. See README.md.
"""
from __future__ import annotations

import hashlib
import hmac
from contextlib import contextmanager
import json
import math
import os
import re
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import uuid

DB_PATH = Path(os.environ.get("SALIM_REPORT_DB", "./data/reports.sqlite3"))
PEPPER = os.environ.get("SALIM_REPORT_PEPPER", "")
MODERATOR_TOKEN = os.environ.get("SALIM_MODERATOR_TOKEN", "")
ALLOWED_ORIGIN = os.environ.get("SALIM_REPORT_ORIGIN", "https://www.salimdrive.com")
MAX_BODY = 12_000
COUNTRIES = {"BH", "SA", "AE", "QA", "KW", "OM"}
KINDS = {"SPEED", "RED_LIGHT", "SEATBELT"}
REPORT_TYPES = {"ADD_CAMERA", "VERIFY_PRESENT", "FLAG_LOCATION", "FLAG_REMOVED", "FLAG_TYPE"}
VOTES = {"CONFIRM", "DISPUTE"}
DECISIONS = {"APPROVE", "REJECT", "NEEDS_REVIEW"}
ID_RE = re.compile(r"^[A-Za-z0-9:/_-]{1,120}$")

SCHEMA = """
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  report_type TEXT NOT NULL,
  camera_id TEXT,
  country TEXT NOT NULL,
  kind TEXT,
  lat REAL,
  lon REAL,
  heading REAL,
  road TEXT,
  accuracy_m REAL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  resolution TEXT
);
CREATE INDEX IF NOT EXISTS reports_queue ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS reports_camera ON reports(camera_id, created_at);
CREATE TABLE IF NOT EXISTS votes (
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  actor_hash TEXT NOT NULL,
  vote TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY(report_id, actor_hash)
);
CREATE TABLE IF NOT EXISTS review_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  report_id TEXT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  decision TEXT NOT NULL,
  resolution TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS cameras (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  kind TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  heading REAL,
  road TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  source_report_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS camera_overrides (
  camera_id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  status TEXT NOT NULL,
  kind TEXT,
  lat REAL,
  lon REAL,
  heading REAL,
  road TEXT,
  verified_at INTEGER NOT NULL,
  source_report_id TEXT NOT NULL
);
"""


def now() -> int:
    return int(time.time())


def open_db() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DB_PATH, timeout=10, isolation_level=None)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.executescript(SCHEMA)
    # Remove report/vote/moderation details after one year. Approved camera
    # records and status overrides retain only their non-user provenance ID.
    db.execute("DELETE FROM reports WHERE created_at < ?", (now() - 365 * 86400,))
    return db


@contextmanager
def db_session():
    db = open_db()
    try:
        yield db
    finally:
        db.close()


def actor_hash(installation_id: str) -> str:
    if len(PEPPER) < 32:
        raise RuntimeError("SALIM_REPORT_PEPPER must be a random secret of at least 32 characters")
    return hmac.new(PEPPER.encode(), installation_id.encode(), hashlib.sha256).hexdigest()


def valid_point(lat: object, lon: object) -> bool:
    return (isinstance(lat, (int, float)) and not isinstance(lat, bool)
            and isinstance(lon, (int, float)) and not isinstance(lon, bool)
            and -90 <= lat <= 90 and -180 <= lon <= 180)


def distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    a1, a2 = math.radians(lat1), math.radians(lat2)
    dlat, dlon = a2 - a1, math.radians(lon2 - lon1)
    h = math.sin(dlat / 2) ** 2 + math.cos(a1) * math.cos(a2) * math.sin(dlon / 2) ** 2
    return 6_371_000 * 2 * math.asin(min(1, math.sqrt(h)))


def clean_text(value: object, limit: int) -> str:
    if not isinstance(value, str):
        return ""
    return " ".join(value.replace("\x00", "").split())[:limit]


class APIError(Exception):
    def __init__(self, status: int, message: str):
        self.status, self.message = status, message


class Handler(BaseHTTPRequestHandler):
    server_version = "SalimReports/1.0"

    def log_message(self, _fmt: str, *_args: object) -> None:
        # Do not put request bodies, coordinates, or client addresses in default access logs.
        return

    def _send_asset(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()
        self.wfile.write(body)

    def _send_html(self, status: int, body: bytes) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()
        self.wfile.write(body)

    def _send(self, status: int, data: object) -> None:
        body = json.dumps(data, ensure_ascii=False, separators=(",", ":")).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
        self.send_header("Vary", "Origin")
        self.end_headers()
        self.wfile.write(body)

    def _body(self) -> dict:
        raw_length = self.headers.get("Content-Length", "0")
        if not raw_length.isdigit() or int(raw_length) > MAX_BODY:
            raise APIError(413, "Request body too large")
        try:
            value = json.loads(self.rfile.read(int(raw_length)) or b"{}")
        except (ValueError, UnicodeDecodeError):
            raise APIError(400, "Invalid JSON")
        if not isinstance(value, dict):
            raise APIError(400, "Expected a JSON object")
        return value

    def _auth(self) -> None:
        header = self.headers.get("Authorization", "")
        expected = "Bearer " + MODERATOR_TOKEN
        if len(MODERATOR_TOKEN) < 32 or not hmac.compare_digest(header, expected):
            raise APIError(401, "Moderator authentication required")

    def _route(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        parts = [p for p in path.split("/") if p]
        return path, parts, parse_qs(parsed.query)

    def _run(self, method: str) -> None:
        try:
            if method == "OPTIONS":
                origin = self.headers.get("Origin")
                if origin and origin != ALLOWED_ORIGIN:
                    raise APIError(403, "Origin not allowed")
                self.send_response(204)
                self.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
                self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Authorization,Content-Type")
                self.send_header("Access-Control-Max-Age", "600")
                self.end_headers()
                return
            path, parts, query = self._route()
            origin = self.headers.get("Origin")
            if origin and origin != ALLOWED_ORIGIN:
                raise APIError(403, "Origin not allowed")
            if method == "GET" and path == "/admin":
                self._send_html(200, Path(__file__).with_name("admin.html").read_bytes())
                return
            if method == "GET" and path == "/admin.js":
                self._send_asset(200, Path(__file__).with_name("admin.js").read_bytes(), "text/javascript; charset=utf-8")
                return
            if method == "GET" and path == "/health":
                self._send(200, {"ok": True, "service": "salim-camera-reports"})
                return
            if method == "POST" and path == "/v1/reports":
                self._create_report(self._body())
                return
            if method == "GET" and path == "/v1/reports":
                self._public_queue(query)
                return
            if method == "POST" and len(parts) == 4 and parts[:2] == ["v1", "reports"] and parts[3] == "votes":
                self._vote(parts[2], self._body())
                return
            if method == "GET" and len(parts) == 3 and parts[:2] == ["v1", "reports"] and parts[2]:
                self._summary(parts[2])
                return
            if method == "GET" and path == "/v1/cameras":
                self._public_cameras(query)
                return
            if method == "GET" and path == "/v1/camera-overrides":
                self._camera_overrides(query)
                return
            if parts[:2] == ["v1", "admin"]:
                self._auth()
                if method == "GET" and path == "/v1/admin/reports":
                    self._admin_queue(query)
                    return
                if method == "GET" and len(parts) == 5 and parts[2] == "reports" and parts[4] == "history":
                    self._admin_history(parts[3])
                    return
                if method == "POST" and len(parts) == 5 and parts[2] == "reports" and parts[4] == "decision":
                    self._decide(parts[3], self._body())
                    return
            raise APIError(404, "Not found")
        except APIError as error:
            self._send(error.status, {"error": error.message})
        except (sqlite3.Error, OSError, RuntimeError):
            self._send(503, {"error": "Report service temporarily unavailable"})

    def do_GET(self): self._run("GET")
    def do_POST(self): self._run("POST")
    def do_OPTIONS(self): self._run("OPTIONS")

    def _public_queue(self, query: dict) -> None:
        country = query.get("country", [""])[0].upper()
        if country not in COUNTRIES:
            raise APIError(422, "A GCC country code is required")
        with db_session() as db:
            rows = db.execute("""SELECT r.id,r.report_type,r.camera_id,r.country,r.kind,r.lat,r.lon,r.heading,r.road,r.status,r.created_at,
                COALESCE(SUM(CASE WHEN v.vote='CONFIRM' THEN 1 ELSE 0 END),0) AS confirmations,
                COALESCE(SUM(CASE WHEN v.vote='DISPUTE' THEN 1 ELSE 0 END),0) AS disputes
                FROM reports r LEFT JOIN votes v ON v.report_id=r.id
                WHERE r.country=? AND r.status IN ('PENDING','NEEDS_REVIEW')
                GROUP BY r.id ORDER BY r.created_at DESC LIMIT 100""", (country,)).fetchall()
        self._send(200, {"country": country, "reports": [dict(row) for row in rows]})

    def _create_report(self, body: dict) -> None:
        report_type = body.get("report_type")
        country = body.get("country")
        install = body.get("installation_id")
        kind = body.get("kind")
        camera_id = body.get("camera_id")
        if not isinstance(report_type, str) or report_type not in REPORT_TYPES or not isinstance(country, str) or country not in COUNTRIES:
            raise APIError(422, "Unsupported report type or country")
        if not isinstance(install, str):
            raise APIError(422, "Invalid installation identifier")
        try: uuid.UUID(install)
        except (ValueError, AttributeError): raise APIError(422, "Invalid installation identifier")
        if kind is not None and (not isinstance(kind, str) or kind not in KINDS):
            raise APIError(422, "Unsupported camera type")
        if camera_id is not None and (not isinstance(camera_id, str) or not ID_RE.fullmatch(camera_id)):
            raise APIError(422, "Invalid camera identifier")
        if report_type != "ADD_CAMERA" and not camera_id:
            raise APIError(422, "A camera identifier is required")
        lat, lon = body.get("lat"), body.get("lon")
        accuracy = body.get("accuracy_m")
        if report_type == "ADD_CAMERA":
            if kind not in KINDS or not valid_point(lat, lon):
                raise APIError(422, "A camera type and valid coordinate are required")
            if not isinstance(accuracy, (int, float)) or isinstance(accuracy, bool) or not 1 <= accuracy <= 50:
                raise APIError(422, "Location accuracy must be 50 m or better")
        elif lat is not None and not valid_point(lat, lon):
            raise APIError(422, "Invalid proposed coordinate")
        if report_type == "FLAG_LOCATION" and not valid_point(lat, lon):
            raise APIError(422, "A corrected camera coordinate is required")
        if report_type == "FLAG_TYPE" and kind not in KINDS:
            raise APIError(422, "Select the corrected camera type")
        if report_type == "FLAG_LOCATION" and (not isinstance(accuracy, (int, float)) or isinstance(accuracy, bool) or not 1 <= accuracy <= 50):
            raise APIError(422, "Corrected location accuracy must be 50 m or better")
        heading = body.get("heading")
        if heading is not None and (not isinstance(heading, (int, float)) or isinstance(heading, bool) or not 0 <= heading < 360):
            raise APIError(422, "Invalid direction")
        road = clean_text(body.get("road"), 120)
        actor = actor_hash(install)
        stamp = now()
        report_id = str(uuid.uuid4())
        with db_session() as db:
            db.execute("BEGIN IMMEDIATE")
            recent = db.execute("SELECT COUNT(*) FROM reports WHERE created_at>? AND id IN (SELECT report_id FROM votes WHERE actor_hash=?)", (stamp - 86400, actor)).fetchone()[0]
            if recent >= 12:
                db.rollback()
                raise APIError(429, "Daily report limit reached")
            if report_type == "ADD_CAMERA":
                possible = db.execute("SELECT lat,lon FROM reports WHERE report_type='ADD_CAMERA' AND country=? AND kind=? AND status IN ('PENDING','NEEDS_REVIEW','APPROVED') AND created_at>?", (country, kind, stamp - 86400)).fetchall()
                duplicate = any(distance_m(lat, lon, row["lat"], row["lon"]) < 120 for row in possible)
            else:
                duplicate = db.execute("SELECT 1 FROM reports WHERE camera_id=? AND report_type=? AND status IN ('PENDING','NEEDS_REVIEW') AND created_at>?", (camera_id, report_type, stamp - 86400)).fetchone()
            if duplicate:
                db.rollback()
                raise APIError(409, "A recent report for this camera or location is already under review")
            db.execute("INSERT INTO reports(id,report_type,camera_id,country,kind,lat,lon,heading,road,accuracy_m,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
                       (report_id, report_type, camera_id, country, kind, lat, lon, heading, road, accuracy, stamp))
            db.execute("INSERT INTO votes(report_id,actor_hash,vote,created_at) VALUES(?,?,?,?)", (report_id, actor, "SUBMITTED", stamp))
            db.commit()
        self._send(201, {"id": report_id, "status": "PENDING", "message": "Sent for human review. This report does not change camera alerts."})

    def _vote(self, report_id: str, body: dict) -> None:
        try: uuid.UUID(report_id)
        except ValueError: raise APIError(404, "Report not found")
        install, vote = body.get("installation_id"), body.get("vote")
        try: uuid.UUID(install) if isinstance(install, str) else None
        except ValueError: install = None
        if not isinstance(install, str) or not isinstance(vote, str) or vote not in VOTES:
            raise APIError(422, "Invalid confirmation")
        actor, stamp = actor_hash(install), now()
        with db_session() as db:
            if not db.execute("SELECT 1 FROM reports WHERE id=? AND status IN ('PENDING','NEEDS_REVIEW')", (report_id,)).fetchone():
                raise APIError(404, "Open report not found")
            voted_today = db.execute("SELECT COUNT(*) FROM votes WHERE actor_hash=? AND vote IN ('CONFIRM','DISPUTE') AND created_at>?", (actor, stamp - 86400)).fetchone()[0]
            if voted_today >= 30:
                raise APIError(429, "Daily confirmation limit reached")
            try:
                db.execute("INSERT INTO votes(report_id,actor_hash,vote,created_at) VALUES(?,?,?,?)", (report_id, actor, vote, stamp))
            except sqlite3.IntegrityError:
                raise APIError(409, "This device has already responded to this report")
        self._send(201, {"status": "recorded", "message": "Confirmation recorded; a moderator will review the report."})

    def _summary(self, report_id: str) -> None:
        with db_session() as db:
            row = db.execute("SELECT id,report_type,country,kind,status,created_at FROM reports WHERE id=?", (report_id,)).fetchone()
            if row is None: raise APIError(404, "Report not found")
            counts = db.execute("SELECT vote,COUNT(*) AS n FROM votes WHERE report_id=? AND vote IN ('CONFIRM','DISPUTE') GROUP BY vote", (report_id,)).fetchall()
        self._send(200, {**dict(row), "confirmations": {r["vote"].lower(): r["n"] for r in counts}})

    def _admin_queue(self, query: dict) -> None:
        status = query.get("status", ["PENDING"])[0].upper()
        if status not in {"PENDING", "NEEDS_REVIEW", "APPROVED", "REJECTED", "ALL"}:
            raise APIError(422, "Invalid queue status")
        with db_session() as db:
            where, args = ("", []) if status == "ALL" else ("WHERE r.status=?", [status])
            rows = db.execute(f"""SELECT r.*,SUM(CASE WHEN v.vote='CONFIRM' THEN 1 ELSE 0 END) AS confirmations,
                SUM(CASE WHEN v.vote='DISPUTE' THEN 1 ELSE 0 END) AS disputes
                FROM reports r LEFT JOIN votes v ON v.report_id=r.id {where}
                GROUP BY r.id ORDER BY r.created_at ASC LIMIT 500""", args).fetchall()
        self._send(200, {"reports": [dict(row) for row in rows]})

    def _admin_history(self, report_id: str) -> None:
        try: uuid.UUID(report_id)
        except ValueError: raise APIError(404, "Report not found")
        with db_session() as db:
            if not db.execute("SELECT 1 FROM reports WHERE id=?", (report_id,)).fetchone():
                raise APIError(404, "Report not found")
            reviews = db.execute("SELECT decision,resolution,created_at FROM review_log WHERE report_id=? ORDER BY created_at", (report_id,)).fetchall()
            votes = db.execute("SELECT vote,created_at FROM votes WHERE report_id=? AND vote IN ('CONFIRM','DISPUTE') ORDER BY created_at", (report_id,)).fetchall()
        events = ([{"event": "moderator_review", **dict(row)} for row in reviews]
                  + [{"event": "community_vote", **dict(row)} for row in votes])
        events.sort(key=lambda row: row["created_at"])
        self._send(200, {"history": events})

    def _decide(self, report_id: str, body: dict) -> None:
        try: uuid.UUID(report_id)
        except ValueError: raise APIError(404, "Report not found")
        decision = body.get("decision")
        resolution = body.get("resolution")
        allowed_resolution = {"PUBLISH_NEW_CAMERA", "CONFIRM_PRESENT", "APPLY_LOCATION", "MARK_REMOVED", "CORRECT_TYPE", "NO_CHANGE"}
        if not isinstance(decision, str) or decision not in DECISIONS or (resolution is not None and (not isinstance(resolution, str) or resolution not in allowed_resolution)):
            raise APIError(422, "Invalid moderation decision")
        stamp = now()
        with db_session() as db:
            db.execute("BEGIN IMMEDIATE")
            report = db.execute("SELECT * FROM reports WHERE id=?", (report_id,)).fetchone()
            if report is None: db.rollback(); raise APIError(404, "Report not found")
            if report["status"] not in ("PENDING", "NEEDS_REVIEW"):
                db.rollback(); raise APIError(409, "Report has already been reviewed")
            if decision == "APPROVE":
                expected = {
                    "ADD_CAMERA": {"PUBLISH_NEW_CAMERA"},
                    "VERIFY_PRESENT": {"CONFIRM_PRESENT"},
                    "FLAG_LOCATION": {"APPLY_LOCATION"},
                    "FLAG_REMOVED": {"MARK_REMOVED"},
                    "FLAG_TYPE": {"CORRECT_TYPE"},
                }
                if resolution not in expected[report["report_type"]]:
                    db.rollback(); raise APIError(422, "Choose the resolution appropriate to this report type")
                if report["report_type"] == "ADD_CAMERA":
                    camera_id = "community:" + report_id
                    db.execute("INSERT INTO cameras(id,country,kind,lat,lon,heading,road,source_report_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
                               (camera_id, report["country"], report["kind"], report["lat"], report["lon"], report["heading"], report["road"] or "", report_id, stamp, stamp))
                elif report["camera_id"] and resolution in {"CONFIRM_PRESENT", "APPLY_LOCATION", "MARK_REMOVED", "CORRECT_TYPE"}:
                    status = "REMOVED" if resolution == "MARK_REMOVED" else "ACTIVE"
                    db.execute("""INSERT INTO camera_overrides(camera_id,country,status,kind,lat,lon,heading,road,verified_at,source_report_id)
                        VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(camera_id) DO UPDATE SET country=excluded.country,status=excluded.status,
                        kind=COALESCE(excluded.kind,camera_overrides.kind),lat=COALESCE(excluded.lat,camera_overrides.lat),
                        lon=COALESCE(excluded.lon,camera_overrides.lon),heading=COALESCE(excluded.heading,camera_overrides.heading),
                        road=COALESCE(excluded.road,camera_overrides.road),verified_at=excluded.verified_at,source_report_id=excluded.source_report_id""",
                        (report["camera_id"], report["country"], status, report["kind"], report["lat"], report["lon"], report["heading"], report["road"], stamp, report_id))
                elif resolution not in {None, "NO_CHANGE", "CONFIRM_PRESENT", "MARK_REMOVED", "CORRECT_TYPE"}:
                    db.rollback(); raise APIError(422, "This resolution does not fit the report")
            new_status = {"APPROVE": "APPROVED", "REJECT": "REJECTED", "NEEDS_REVIEW": "NEEDS_REVIEW"}[decision]
            db.execute("UPDATE reports SET status=?,reviewed_at=?,resolution=? WHERE id=?", (new_status, stamp, resolution, report_id))
            db.execute("INSERT INTO review_log(report_id,decision,resolution,created_at) VALUES(?,?,?,?)", (report_id, decision, resolution, stamp))
            db.commit()
        self._send(200, {"id": report_id, "status": new_status, "resolution": resolution})

    def _public_cameras(self, query: dict) -> None:
        country = query.get("country", [""])[0].upper()
        if country not in COUNTRIES: raise APIError(422, "A GCC country code is required")
        with db_session() as db:
            rows = db.execute("SELECT id,country,kind,lat,lon,heading,road,updated_at FROM cameras WHERE country=? AND status='ACTIVE' ORDER BY id LIMIT 1000", (country,)).fetchall()
        self._send(200, {"country": country, "source": "Salim community reports, human-reviewed", "cameras": [dict(row) for row in rows]})

    def _camera_overrides(self, query: dict) -> None:
        raw = query.get("ids", [""])[0]
        ids = [item for item in raw.split(",") if ID_RE.fullmatch(item)][:100]
        country = query.get("country", [""])[0].upper()
        with db_session() as db:
            if ids:
                placeholders = ",".join("?" for _ in ids)
                rows = db.execute(f"SELECT camera_id,country,status,kind,lat,lon,heading,road,verified_at FROM camera_overrides WHERE camera_id IN ({placeholders})", ids).fetchall()
            elif country in COUNTRIES:
                rows = db.execute("SELECT camera_id,country,status,kind,lat,lon,heading,road,verified_at FROM camera_overrides WHERE country=? ORDER BY camera_id LIMIT 1000", (country,)).fetchall()
            else:
                raise APIError(422, "Supply camera IDs or a GCC country code")
        self._send(200, {"overrides": [dict(row) for row in rows]})


def main() -> None:
    if len(PEPPER) < 32 or len(MODERATOR_TOKEN) < 32:
        raise SystemExit("Set SALIM_REPORT_PEPPER and SALIM_MODERATOR_TOKEN (32+ characters each) before starting.")
    open_db().close()
    host, port = os.environ.get("HOST", "0.0.0.0"), int(os.environ.get("PORT", "8080"))
    ThreadingHTTPServer((host, port), Handler).serve_forever()

if __name__ == "__main__":
    main()
