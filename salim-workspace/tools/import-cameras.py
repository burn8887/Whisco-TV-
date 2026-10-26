#!/usr/bin/env python3
"""Build or validate Salim's camera pack.

The camera list lives in `assets/cameras.csv` beside the Android app so it can be
read, corrected and replaced without touching code. This tool turns whatever you can copy
from a source into that file, and checks it before it ships.

Usage
-----
Validate the shipped pack:

    python3 tools/import-cameras.py --check

Convert a table you pasted or downloaded (CSV, TSV, or a spreadsheet copy):

    python3 tools/import-cameras.py --input pasted.csv --output cameras.csv

Check a file you made by hand:

    python3 tools/import-cameras.py --check

Input columns
-------------
Recognised by header name, in any order. Only `lat` and `lon` are required.

    lat, lon            decimal degrees, WGS84
    road                street or highway name
    kind                CAMERA | SEATBELT | RED_LIGHT | MOBILE_CAMERA   (default CAMERA)
    speed_limit         posted limit, km/h
    heading             bearing the camera watches, degrees
    precision           exact | approximate                            (default approximate)
    source              where the row came from

Without a header the tool assumes: lat, lon, road, kind, speed_limit.

Why "approximate" is the default
--------------------------------
A camera known only to "somewhere on this highway" and one surveyed to a metre produce the
same alert but not the same claim. The app draws approximate sites as hollow rings and
shows a ≈ before the road name, because a filled dot reads to a driver as certainty.
"""

from __future__ import annotations

import argparse
import csv
import io
import sys
from pathlib import Path

# Bahrain and its immediate approaches. A row outside this box is a typo, not a camera.
LAT_RANGE = (25.60, 26.40)
LON_RANGE = (50.20, 50.85)

KINDS = {"CAMERA", "SEATBELT", "RED_LIGHT", "MOBILE_CAMERA"}
PRECISIONS = {"exact", "approximate"}

HEADER = [
    "id", "kind", "lat", "lon", "road", "speed_limit", "heading", "precision", "source",
]

def default_pack_path() -> Path:
    """Locate the pack by glob.

    The Android app sits at a different depth in the capsule and in the promoted
    repository, so a literal path here would be wrong in one of them.
    """
    root = Path(__file__).resolve().parent.parent
    matches = sorted(root.glob("apps/*/app/src/main/assets/cameras.csv"))
    if matches:
        return matches[0]
    return root / "apps" / "missing" / "assets" / "cameras.csv"

ALIASES = {
    "lat": "lat", "latitude": "lat",
    "lon": "lon", "lng": "lon", "long": "lon", "longitude": "lon",
    "road": "road", "road_name": "road", "location": "road", "place": "road", "street": "road",
    "kind": "kind", "type": "kind",
    "speed_limit": "speed_limit", "limit": "speed_limit", "speed": "speed_limit",
    "heading": "heading", "bearing": "heading", "direction": "heading",
    "precision": "precision", "accuracy": "precision",
    "source": "source", "ref": "source", "note": "source",
}


def normalise_header(cells: list[str]) -> dict[str, int] | None:
    mapping: dict[str, int] = {}
    for index, raw in enumerate(cells):
        key = ALIASES.get(raw.strip().lower().replace(" ", "_"))
        if key and key not in mapping:
            mapping[key] = index
    return mapping if "lat" in mapping and "lon" in mapping else None


def slug(text: str, fallback: str) -> str:
    kept = [c.lower() if c.isalnum() else "-" for c in text.strip()]
    slugged = "".join(kept).strip("-")
    while "--" in slugged:
        slugged = slugged.replace("--", "-")
    return (slugged or fallback)[:48]


def convert_row(cells: list[str], columns: dict[str, int], seq: int) -> tuple[dict | None, str | None]:
    def cell(name: str) -> str:
        index = columns.get(name)
        if index is None or index >= len(cells):
            return ""
        return cells[index].strip()

    lat_text, lon_text = cell("lat"), cell("lon")
    try:
        lat, lon = float(lat_text), float(lon_text)
    except ValueError:
        return None, f"row {seq}: unreadable coordinate '{lat_text},{lon_text}'"

    if not (LAT_RANGE[0] <= lat <= LAT_RANGE[1] and LON_RANGE[0] <= lon <= LON_RANGE[1]):
        return None, f"row {seq}: {lat},{lon} is outside Bahrain"

    kind = (cell("kind") or "CAMERA").upper().replace(" ", "_")
    if kind not in KINDS:
        return None, f"row {seq}: unknown kind '{kind}'"

    limit_text = cell("speed_limit")
    limit = ""
    if limit_text:
        digits = "".join(c for c in limit_text if c.isdigit())
        if digits and 30 <= int(digits) <= 160:
            limit = str(int(digits))
        else:
            return None, f"row {seq}: speed limit '{limit_text}' is not between 30 and 160"

    heading_text = cell("heading")
    heading = ""
    if heading_text:
        try:
            bearing = float(heading_text)
        except ValueError:
            return None, f"row {seq}: bearing '{heading_text}' is not a number"
        if 0 <= bearing < 360:
            heading = f"{bearing:g}"
        else:
            return None, f"row {seq}: bearing {bearing} is outside 0-359"

    precision = (cell("precision") or "approximate").lower()
    if precision not in PRECISIONS:
        return None, f"row {seq}: precision '{precision}' is not exact or approximate"

    road = cell("road") or "Unnamed road"
    source = cell("source") or "unspecified"

    return {
        "id": f"camera:{slug(road, 'site')}-{seq}",
        "kind": kind,
        "lat": f"{lat:.6f}",
        "lon": f"{lon:.6f}",
        "road": road[:200],
        "speed_limit": limit,
        "heading": heading,
        "precision": precision,
        "source": source[:200],
    }, None


def convert(text: str) -> tuple[list[dict], list[str]]:
    """Returns (rows, warnings). The first line is a header if it names lat and lon."""
    sample = text.strip()
    if not sample:
        return [], ["input is empty"]
    delimiter = "\t" if "\t" in sample.splitlines()[0] else ","
    reader = list(csv.reader(io.StringIO(sample), delimiter=delimiter))
    reader = [r for r in reader if any(c.strip() for c in r) and not r[0].lstrip().startswith("#")]
    if not reader:
        return [], ["input has no data rows"]

    columns = normalise_header(reader[0])
    if columns is None:
        columns = {"lat": 0, "lon": 1, "road": 2, "kind": 3, "speed_limit": 4}
        rows = reader
    else:
        rows = reader[1:]

    out: list[dict] = []
    warnings: list[str] = []
    seen: set[tuple[str, str]] = set()
    for seq, cells in enumerate(rows, start=1):
        row, problem = convert_row(cells, columns, seq)
        if problem:
            warnings.append(problem)
            continue
        assert row is not None
        key = (row["lat"][:7], row["lon"][:7])
        if key in seen:
            warnings.append(f"row {seq}: duplicate of an earlier coordinate, skipped")
            continue
        seen.add(key)
        out.append(row)
    return out, warnings


def write_pack(rows: list[dict], destination: Path) -> None:
    header_note = (
        "# Salim camera pack. One row per camera site.\n"
        "#\n"
        "#   id,kind,lat,lon,road,speed_limit,heading,precision,source\n"
        "#\n"
        "# kind          CAMERA | SEATBELT | RED_LIGHT | MOBILE_CAMERA\n"
        "# speed_limit   posted limit in km/h, blank if unknown\n"
        "# heading       bearing the camera watches, blank if it watches both directions\n"
        "# precision     exact | approximate   (\"approximate\" is shown to the driver as a ring)\n"
        "# source        where this row came from; keep it short and truthful\n"
        "#\n"
        "# Edit this file, rebuild, and the app uses the new data. Nothing is hidden in code.\n"
        "# Rows outside Bahrain, or with an unreadable coordinate, are skipped rather than\n"
        "# crashing the app, so a bad line costs one camera and nothing else.\n"
    )
    buffer = io.StringIO()
    buffer.write(header_note)
    writer = csv.DictWriter(buffer, fieldnames=HEADER, lineterminator="\n")
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(buffer.getvalue(), encoding="utf-8")


def read_pack(path: Path) -> tuple[list[dict], list[str]]:
    if not path.is_file():
        return [], [f"{path} does not exist"]
    lines = [line for line in path.read_text(encoding="utf-8").splitlines()
             if line.strip() and not line.lstrip().startswith("#")]
    reader = list(csv.reader(io.StringIO("\n".join(lines))))
    if not reader:
        return [], [f"{path} has no rows"]
    columns = normalise_header(reader[0])
    if columns is None:
        return [], [f"{path} header must name at least lat and lon"]

    rows: list[dict] = []
    warnings: list[str] = []
    ids: set[str] = set()
    for seq, cells in enumerate(reader[1:], start=2):
        row, problem = convert_row(cells, columns, seq)
        if problem:
            warnings.append(str(problem))
            continue
        assert row is not None
        if not row["id"].startswith("camera:"):
            warnings.append(f"row {seq}: id '{row['id']}' must start with camera:")
            continue
        if row["id"] in ids:
            warnings.append(f"row {seq}: duplicate id '{row['id']}'")
            continue
        ids.add(row["id"])
        rows.append(row)
    return rows, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Build or validate Salim's camera pack.")
    parser.add_argument("--input", type=Path, help="table to convert (CSV or TSV)")
    parser.add_argument("--output", type=Path, help="where to write the pack")
    parser.add_argument("--check", nargs="?", const=default_pack_path(), type=Path,
                        help="validate a pack (default: the shipped pack)")
    args = parser.parse_args()

    if args.check is not None:
        rows, warnings = read_pack(args.check)
        for warning in warnings:
            print(f"  [warn] {warning}")
        exact = sum(1 for r in rows if r["precision"] == "exact")
        print(f"  {len(rows)} camera sites: {exact} exact, {len(rows) - exact} approximate")
        by_kind: dict[str, int] = {}
        for row in rows:
            by_kind[row["kind"]] = by_kind.get(row["kind"], 0) + 1
        for kind, count in sorted(by_kind.items()):
            print(f"    {kind:<14} {count}")
        if not rows:
            print("  no usable rows", file=sys.stderr)
            return 1
        return 0 if not warnings else 0

    if args.input is None:
        parser.print_help()
        return 2

    rows, warnings = convert(args.input.read_text(encoding="utf-8"))
    for warning in warnings:
        print(f"  [skip] {warning}", file=sys.stderr)
    if not rows:
        print("no convertible rows", file=sys.stderr)
        return 1

    destination = args.output or default_pack_path()
    write_pack(rows, destination)
    exact = sum(1 for r in rows if r["precision"] == "exact")
    print(f"wrote {len(rows)} cameras to {destination} ({exact} exact, {len(rows) - exact} approximate)")
    print("rebuild the Android app for the change to take effect, then reinstall.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
