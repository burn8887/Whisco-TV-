import json
import tempfile
import threading
import unittest
import uuid
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import server


class ReportAPITest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        server.DB_PATH = Path(self.temp.name) / "reports.sqlite3"
        server.PEPPER = "test-only-pepper-" + ("x" * 40)
        server.MODERATOR_TOKEN = "test-only-moderator-" + ("y" * 40)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
        self.thread = threading.Thread(target=self.httpd.serve_forever, daemon=True)
        self.thread.start()
        self.base = f"http://127.0.0.1:{self.httpd.server_port}"

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        self.thread.join(timeout=3)
        self.temp.cleanup()

    def request(self, path, body=None, token=None, origin=None):
        data = None if body is None else json.dumps(body).encode()
        headers = {}
        if data is not None:
            headers["Content-Type"] = "application/json"
        if token:
            headers["Authorization"] = "Bearer " + token
        if origin:
            headers["Origin"] = origin
        req = Request(self.base + path, data=data, headers=headers, method="GET" if body is None else "POST")
        try:
            with urlopen(req, timeout=3) as response:
                return response.status, json.loads(response.read())
        except HTTPError as error:
            return error.code, json.loads(error.read())

    def add_camera(self):
        installation_id = str(uuid.uuid4())
        status, result = self.request("/v1/reports", {
            "installation_id": installation_id,
            "report_type": "ADD_CAMERA",
            "country": "BH",
            "kind": "SPEED",
            "lat": 26.225,
            "lon": 50.582,
            "accuracy_m": 8.0,
            "heading": 90.0,
            "road": "Test road"
        })
        self.assertEqual(status, 201)
        return result["id"], installation_id

    def test_new_camera_stays_private_until_moderator_approval(self):
        report_id, submitter_id = self.add_camera()
        status, cameras = self.request("/v1/cameras?country=BH")
        self.assertEqual(status, 200)
        self.assertEqual(cameras["cameras"], [])
        status, summary = self.request(f"/v1/reports/{report_id}")
        self.assertEqual(summary["confirmations"], {})
        outsider = str(uuid.uuid4())
        status, _ = self.request(f"/v1/reports/{report_id}/votes", {"installation_id": outsider, "vote": "CONFIRM"})
        self.assertEqual(status, 201)
        status, _ = self.request(f"/v1/reports/{report_id}/votes", {"installation_id": outsider, "vote": "CONFIRM"})
        self.assertEqual(status, 409)
        status, queue = self.request("/v1/admin/reports?status=PENDING", token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        self.assertEqual(queue["reports"][0]["confirmations"], 1)
        status, decision = self.request(f"/v1/admin/reports/{report_id}/decision", {
            "decision": "APPROVE", "resolution": "PUBLISH_NEW_CAMERA"
        }, token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        self.assertEqual(decision["status"], "APPROVED")
        status, cameras = self.request("/v1/cameras?country=BH")
        self.assertEqual(status, 200)
        self.assertEqual(len(cameras["cameras"]), 1)
        self.assertEqual(cameras["cameras"][0]["id"], "community:" + report_id)
        status, history = self.request(f"/v1/admin/reports/{report_id}/history", token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        self.assertEqual(history["history"][0]["decision"], "APPROVE")
        with server.db_session() as db:
            hashes = [row[0] for row in db.execute("SELECT actor_hash FROM votes")]
        self.assertNotIn(submitter_id, hashes)
        self.assertNotIn(outsider, hashes)

    def test_admin_requires_token_and_moderator_decision_is_type_specific(self):
        report_id, _ = self.add_camera()
        status, _ = self.request("/v1/admin/reports")
        self.assertEqual(status, 401)
        status, body = self.request(f"/v1/admin/reports/{report_id}/decision", {
            "decision": "APPROVE", "resolution": "CONFIRM_PRESENT"
        }, token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 422)
        status, queue = self.request("/v1/admin/reports?status=PENDING", token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        self.assertEqual(queue["reports"][0]["status"], "PENDING")

    def test_invalid_location_and_unapproved_origin_are_rejected(self):
        status, _ = self.request("/v1/reports", {
            "installation_id": str(uuid.uuid4()), "report_type": "ADD_CAMERA", "country": "BH",
            "kind": "SPEED", "lat": 200, "lon": 50, "accuracy_m": 5
        })
        self.assertEqual(status, 422)
        status, _ = self.request("/v1/cameras?country=BH", origin="https://attacker.invalid")
        self.assertEqual(status, 403)
        status, _ = self.request("/v1/reports", {
            "installation_id": str(uuid.uuid4()), "report_type": [], "country": "BH"
        })
        self.assertEqual(status, 422)

    def test_camera_presence_and_removal_overrides_need_human_review(self):
        installation_id = str(uuid.uuid4())
        status, report = self.request("/v1/reports", {
            "installation_id": installation_id, "report_type": "VERIFY_PRESENT", "country": "BH",
            "kind": "SPEED", "camera_id": "osm:node/42", "lat": 26.2, "lon": 50.5
        })
        self.assertEqual(status, 201)
        status, overrides = self.request("/v1/camera-overrides?ids=osm:node%2F42")
        self.assertEqual(status, 200)
        self.assertEqual(overrides["overrides"], [])
        status, _ = self.request(f"/v1/admin/reports/{report['id']}/decision", {
            "decision": "APPROVE", "resolution": "CONFIRM_PRESENT"
        }, token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        status, overrides = self.request("/v1/camera-overrides?ids=osm:node%2F42")
        self.assertEqual(status, 200)
        self.assertEqual(overrides["overrides"][0]["status"], "ACTIVE")
        status, country_overrides = self.request("/v1/camera-overrides?country=BH")
        self.assertEqual(status, 200)
        self.assertEqual(country_overrides["overrides"][0]["camera_id"], "osm:node/42")

        status, removal = self.request("/v1/reports", {
            "installation_id": str(uuid.uuid4()), "report_type": "FLAG_REMOVED", "country": "BH",
            "kind": "SPEED", "camera_id": "osm:node/42", "lat": 26.2, "lon": 50.5
        })
        self.assertEqual(status, 201)
        status, _ = self.request(f"/v1/admin/reports/{removal['id']}/decision", {
            "decision": "APPROVE", "resolution": "MARK_REMOVED"
        }, token=server.MODERATOR_TOKEN)
        self.assertEqual(status, 200)
        status, overrides = self.request("/v1/camera-overrides?ids=osm:node%2F42")
        self.assertEqual(overrides["overrides"][0]["status"], "REMOVED")

    def test_health_and_moderator_ui_are_available(self):
        with urlopen(self.base + "/health", timeout=3) as response:
            self.assertEqual(response.status, 200)
            self.assertEqual(json.loads(response.read())["service"], "salim-camera-reports")
        with urlopen(self.base + "/admin", timeout=3) as response:
            html = response.read().decode()
            self.assertIn("Human review queue", html)
            self.assertIn("/admin.js", html)


if __name__ == "__main__":
    unittest.main()
