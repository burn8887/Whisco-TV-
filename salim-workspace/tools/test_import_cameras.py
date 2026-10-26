"""Tests for the camera pack importer.

The importer is the only path by which camera data reaches the app, so the rules that keep
a bad row out of a driver's dashboard are worth pinning down.
"""

from __future__ import annotations

import importlib.util
import sys
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("import-cameras.py")
spec = importlib.util.spec_from_file_location("import_cameras", MODULE_PATH)
assert spec and spec.loader
importer = importlib.util.module_from_spec(spec)
sys.modules["import_cameras"] = importer
spec.loader.exec_module(importer)


class ConvertTests(unittest.TestCase):
    def test_header_in_any_order(self):
        rows, warnings = importer.convert("road,lon,lat\nKing Faisal Highway,50.56,26.22\n")
        self.assertEqual(warnings, [])
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["road"], "King Faisal Highway")
        self.assertEqual(rows[0]["lat"], "26.220000")

    def test_tsv_is_detected(self):
        rows, _ = importer.convert("lat\tlon\troad\n26.21\t50.54\tBudaiya Road\n")
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["road"], "Budaiya Road")

    def test_outside_bahrain_is_rejected(self):
        rows, warnings = importer.convert("lat,lon,road\n25.20,51.50,Doha\n")
        self.assertEqual(rows, [])
        self.assertEqual(len(warnings), 1)
        self.assertIn("outside Bahrain", warnings[0])

    def test_unreadable_coordinate_is_rejected(self):
        rows, warnings = importer.convert("lat,lon,road\nnorth,50.5,Somewhere\n")
        self.assertEqual(rows, [])
        self.assertIn("unreadable coordinate", warnings[0])

    def test_unknown_kind_is_rejected(self):
        rows, warnings = importer.convert("lat,lon,road,kind\n26.21,50.54,Test,SPEED_GUN\n")
        self.assertEqual(rows, [])
        self.assertIn("unknown kind", warnings[0])

    def test_speed_limit_bounds(self):
        self.assertEqual(importer.convert("lat,lon,speed_limit\n26.21,50.54,100\n")[0][0]["speed_limit"], "100")
        self.assertEqual(importer.convert("lat,lon,speed_limit\n26.21,50.54,5\n")[0], [])
        self.assertEqual(importer.convert("lat,lon,speed_limit\n26.21,50.54,400\n")[0], [])

    def test_precision_defaults_to_approximate(self):
        rows, _ = importer.convert("lat,lon,road\n26.21,50.54,Test\n")
        self.assertEqual(rows[0]["precision"], "approximate")

    def test_duplicate_coordinates_are_dropped(self):
        rows, warnings = importer.convert("lat,lon,road\n26.2100,50.5400,A\n26.2100,50.5400,B\n")
        self.assertEqual(len(rows), 1)
        self.assertIn("duplicate", warnings[0])

    def test_comments_and_blank_lines_are_ignored(self):
        rows, warnings = importer.convert("# note\n\nlat,lon,road\n26.21,50.54,Test\n\n")
        self.assertEqual(warnings, [])
        self.assertEqual(len(rows), 1)

    def test_quoted_road_name_with_comma(self):
        rows, _ = importer.convert('lat,lon,road\n26.21,50.54,"Road 1, Block 2"\n')
        self.assertEqual(rows[0]["road"], "Road 1, Block 2")

    def test_id_is_derived_and_slugged(self):
        rows, _ = importer.convert("lat,lon,road\n26.21,50.54,Sheikh Khalifa bin Salman Highway\n")
        self.assertEqual(rows[0]["id"], "camera:sheikh-khalifa-bin-salman-highway-1")
        self.assertTrue(rows[0]["id"].startswith("camera:"))


class ShippedPackTests(unittest.TestCase):
    """The pack that ships must satisfy the same rules the importer enforces."""

    def setUp(self):
        # Found by glob rather than by a hard-coded path: the Android app sits at a
        # different depth in the capsule and in the promoted repository, and naming
        # either layout here would go stale in the other.
        here = Path(__file__).resolve().parent.parent
        matches = sorted(here.glob("apps/*/app/src/main/assets/cameras.csv"))
        self.pack = matches[0] if matches else (here / "apps/missing/assets/cameras.csv")

    def test_pack_exists(self):
        self.assertTrue(self.pack.is_file(), f"missing {self.pack}")

    def test_pack_is_valid(self):
        rows, warnings = importer.read_pack(self.pack)
        self.assertEqual(warnings, [], "shipped pack has unusable rows")
        self.assertGreater(len(rows), 0, "shipped pack is empty")

    def test_every_row_carries_a_source(self):
        rows, _ = importer.read_pack(self.pack)
        for row in rows:
            self.assertNotEqual(row["source"], "unspecified", f"{row['id']} has no source")

    def test_kinds_are_cameras_only(self):
        rows, _ = importer.read_pack(self.pack)
        for row in rows:
            self.assertIn(row["kind"], importer.KINDS)


if __name__ == "__main__":
    unittest.main()
