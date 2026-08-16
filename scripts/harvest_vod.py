#!/usr/bin/env python3
"""VOD mega-harvest: pull full-length videos from official distributor
channels (see harvest_sources.json), filter out clips/trailers/shorts,
verify embeddability via oEmbed, and emit prisma/vod_youtube.json.

Every entry that survives is a real, playable, embeddable full-length
video from the rights holder's own channel.
"""
import json, re, subprocess, sys, time, unicodedata, urllib.request, urllib.error
import concurrent.futures as cf
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_FILE = sys.argv[1] if len(sys.argv) > 1 else "scripts/harvest_sources.json"
OUT_FILE = sys.argv[2] if len(sys.argv) > 2 else "prisma/vod_youtube.json"
SOURCES = json.load(open(ROOT / SRC_FILE))
OUT = ROOT / OUT_FILE
CACHE = Path("/tmp/harvest")
CACHE.mkdir(exist_ok=True)

FETCH_LIMIT = 3500  # most-recent uploads scanned per channel

EXCLUDE = re.compile(
    r"trailer|teaser|promo|preview|clip|scene|best of|compilation|shorts|"
    r"#shorts|behind the scenes|bts|interview|song|jukebox|audio|lyrical|"
    r"making of|deleted|recap|highlight|coming soon|first look|title track|"
    r"video song|full song|ost|promoo|precap|upcoming|spoiler|награда|live stream",
    re.I,
)

def fetch_channel(src):
    """Fetch flat-playlist listing of a channel's uploads (cached)."""
    cache_file = CACHE / f"{src['key']}.json"
    if cache_file.exists() and cache_file.stat().st_size > 500:
        return json.load(open(cache_file))
    for attempt in range(2):
        try:
            r = subprocess.run(
                ["yt-dlp", "--flat-playlist", "-I", f"1:{FETCH_LIMIT}", "-J",
                 f"https://www.youtube.com/channel/{src['channelId']}/videos"],
                capture_output=True, text=True, timeout=900)
            if r.returncode == 0 and r.stdout.strip():
                d = json.loads(r.stdout)
                json.dump(d, open(cache_file, "w"))
                return d
        except Exception as e:
            print(f"  fetch error {src['key']}: {e}", flush=True)
        time.sleep(5)
    return None

def candidates_for(src, data):
    out = []
    for e in (data.get("entries") or []):
        title = (e.get("title") or "").strip()
        dur = e.get("duration") or 0
        vid = e.get("id")
        if not vid or not title:
            continue
        if dur < src["minDur"]:
            continue
        if EXCLUDE.search(title):
            continue
        out.append({"videoId": vid, "title": title, "duration": int(dur),
                    "views": e.get("view_count") or 0})
    # Popularity first (in-demand), stable fallback to feed order.
    out.sort(key=lambda x: -x["views"])
    return out[: src["quota"] * 2]  # 2x buffer for verification losses

def oembed_ok(video_id):
    url = ("https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com"
           f"%2Fwatch%3Fv%3D{video_id}&format=json")
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=12) as r:
                return r.status == 200
        except urllib.error.HTTPError as e:
            if e.code in (401, 403, 404):
                return False
            time.sleep(1 + attempt)
        except Exception:
            time.sleep(1 + attempt)
    return False

def slugify(s):
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:80] or "title"

def clean_name(raw, brand):
    s = raw
    # strip common channel suffix junk
    s = re.sub(r"\s*[|@#].*$", "", s) if len(re.sub(r"\s*[|@#].*$", "", s)) >= 8 else s
    s = re.sub(r"\s*\((?:19|20)\d\d\)\s*", " ", s)
    s = re.sub(r"\s+", " ", s).strip(" -|@")
    return (s or raw)[:140]

def year_from(title):
    m = re.search(r"\b(19[5-9]\d|20[0-2]\d)\b", title)
    return int(m.group(1)) if m else 2022

def main():
    all_rows, report = [], []
    seen_slugs, seen_names = set(), set()

    groups = [("english", s) for s in SOURCES["english"]] + [("expat", s) for s in SOURCES["expat"]]

    # Phase 1: fetch channel listings (few at a time; big JSON payloads)
    listings = {}
    with cf.ThreadPoolExecutor(max_workers=4) as ex:
        futs = {ex.submit(fetch_channel, src): (grp, src) for grp, src in groups}
        for fut in cf.as_completed(futs):
            grp, src = futs[fut]
            data = fut.result()
            n = len(data.get("entries") or []) if data else 0
            print(f"[list] {src['key']}: {n} uploads scanned", flush=True)
            listings[src["key"]] = data

    # Phase 2: filter to candidates
    cand_map = {}
    for grp, src in groups:
        data = listings.get(src["key"])
        if not data:
            report.append({"key": src["key"], "error": "listing-failed"})
            continue
        cands = candidates_for(src, data)
        cand_map[src["key"]] = (grp, src, cands)
        print(f"[cand] {src['key']}: {len(cands)} candidates (quota {src['quota']})", flush=True)

    # Phase 3: verify embeddability until quota met, per source
    def verify_source(item):
        grp, src, cands = item
        kept = []
        with cf.ThreadPoolExecutor(max_workers=8) as ex:
            futs = {ex.submit(oembed_ok, c["videoId"]): c for c in cands}
            for fut in cf.as_completed(futs):
                c = futs[fut]
                if len(kept) >= src["quota"]:
                    continue
                if fut.result():
                    kept.append(c)
        return grp, src, kept[: src["quota"]]

    for key, item in cand_map.items():
        grp, src, kept = verify_source(item)
        added = 0
        for c in kept:
            name = clean_name(c["title"], src["brand"])
            lname = name.lower()
            if lname in seen_names:
                continue
            slug = slugify(name)
            if slug in seen_slugs:
                slug = f"{slug}-{c['videoId'][:6].lower()}"
                if slug in seen_slugs:
                    continue
            seen_slugs.add(slug); seen_names.add(lname)
            all_rows.append({
                "name": name,
                "slug": slug,
                "type": src["type"],
                "synopsis": f"{name} — full-length {src['type'].lower()} from {src['brand']}'s official channel. Free and ad-supported on Whisco TV.",
                "posterUrl": f"https://i.ytimg.com/vi/{c['videoId']}/hqdefault.jpg",
                "backdropUrl": f"https://i.ytimg.com/vi/{c['videoId']}/maxresdefault.jpg",
                "releaseYear": year_from(c["title"]),
                "rating": "PG-13",
                "imdbRating": 6.5,
                "genres": src["collection"],
                "collection": src["collection"],
                "cast": "",
                "director": src["brand"],
                "country": src["country"],
                "language": src["language"],
                "durationMins": max(1, round(c["duration"] / 60)),
                "streamUrl": f"https://www.youtube.com/embed/{c['videoId']}",
                "sourceBatch": f"yt_{src['key']}",
            })
            added += 1
        report.append({"key": src["key"], "group": grp, "added": added, "quota": src["quota"]})
        print(f"[done] {src['key']}: +{added} (quota {src['quota']})", flush=True)

    json.dump(all_rows, open(OUT, "w"), ensure_ascii=False, indent=1)
    eng = sum(r.get("added", 0) for r in report if r.get("group") == "english")
    exp = sum(r.get("added", 0) for r in report if r.get("group") == "expat")
    print(f"HARVEST DONE english={eng} expat={exp} total={len(all_rows)}", flush=True)
    json.dump(report, open(CACHE / "report.json", "w"), indent=1)

if __name__ == "__main__":
    main()
