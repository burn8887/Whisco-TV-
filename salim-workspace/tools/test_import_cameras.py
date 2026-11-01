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

    def test_outside_gcc_is_rejected(self):
        # Doha used to fail this test; the pack is GCC-wide now, so the boundary moved.
        rows, warnings = importer.convert("lat,lon,road\n51.5074,-0.1278,London\n")
        self.assertEqual(rows, [])
        self.assertEqual(len(warnings), 1)
        self.assertIn("outside the GCC", warnings[0])

    def test_each_gcc_country_is_inside(self):
        for name, lat, lon in [
            ("Bahrain", 26.22, 50.58), ("Qatar", 25.29, 51.53), ("Kuwait", 29.37, 47.98),
            ("UAE", 25.20, 55.27), ("Oman", 23.59, 58.41), ("Saudi", 24.71, 46.68),
        ]:
            rows, warnings = importer.convert(f"lat,lon,road\n{lat},{lon},{name}\n")
            self.assertEqual(len(rows), 1, f"{name} should be accepted: {warnings}")

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


class OverpassTests(unittest.TestCase):
    """OSM is the live source, so its converter has to reject as firmly as the CSV one."""

    RESPONSE = """{"elements":[
      {"type":"node","id":1,"lat":26.2195,"lon":50.5470,
       "tags":{"highway":"speed_camera","name":"Sheikh Khalifa bin Salman Highway"}},
      {"type":"node","id":2,"lat":25.2854,"lon":51.5310,
       "tags":{"highway":"speed_camera","ref":"Al Corniche"}},
      {"type":"node","id":3,"lat":24.7136,"lon":46.6753,
       "tags":{"highway":"enforcement","enforcement":"maxspeed","name":"King Fahd Road"}},
      {"type":"node","id":4,"lat":51.5074,"lon":-0.1278,
       "tags":{"highway":"speed_camera"}},
      {"type":"node","id":5,"lat":26.25,"lon":50.60},
      {"type":"way","id":6,"tags":{"highway":"speed_camera"}},
      {"type":"node","id":7,"lat":26.20,"lon":50.58,
       "tags":{"highway":"enforcement","enforcement":"traffic_signals","name":"Signal 7"}},
      {"type":"node","id":8,"lat":26.21,"lon":50.59,
       "tags":{"highway":"enforcement","enforcement":"seatbelt","name":"Seatbelt 8"}}
    ]}"""

    def test_gcc_cameras_convert(self):
        rows, _ = importer.convert(self.RESPONSE)
        self.assertEqual(len(rows), 5)
        self.assertEqual({r["id"] for r in rows}, {"osm:node/1", "osm:node/2", "osm:node/3", "osm:node/7", "osm:node/8"})
        self.assertEqual({r["id"]: r["kind"] for r in rows}["osm:node/7"], "RED_LIGHT")
        self.assertEqual({r["id"]: r["kind"] for r in rows}["osm:node/8"], "SEATBELT")

    def test_outside_gcc_is_dropped(self):
        rows, _ = importer.convert(self.RESPONSE)
        self.assertNotIn("osm:node/4", {r["id"] for r in rows})

    def test_untagged_node_is_dropped(self):
        rows, _ = importer.convert(self.RESPONSE)
        self.assertNotIn("osm:node/5", {r["id"] for r in rows})

    def test_way_is_ignored(self):
        rows, _ = importer.convert(self.RESPONSE)
        self.assertNotIn(6, [r for r in rows if "way" in r["id"]])

    def test_osm_rows_are_exact(self):
        rows, _ = importer.convert(self.RESPONSE)
        self.assertTrue(all(r["precision"] == "exact" for r in rows))

    def test_source_names_the_node(self):
        rows, _ = importer.convert(self.RESPONSE)
        by_id = {row["id"]: row for row in rows}
        self.assertEqual(by_id["osm:node/1"]["source"], "OpenStreetMap node 1")

    def test_complete_nonsense_is_not_json(self):
        rows, warnings = importer.convert('{"elements": broken')
        self.assertEqual(rows, [])
        self.assertTrue(warnings)

    def test_empty_response_is_reported(self):
        rows, warnings = importer.convert('{"elements":[]}')
        self.assertEqual(rows, [])
        self.assertIn("no usable camera nodes", warnings[0])


class EmptyPackTests(unittest.TestCase):
    """Until a sourced dataset and redistribution terms are cleared, no static pack ships."""

    def test_no_static_pack_is_bundled(self):
        root = Path(__file__).resolve().parent.parent
        self.assertEqual(importer.default_pack_paths(), [])
        self.assertFalse(any(root.glob("apps/*/app/src/main/assets/cameras.csv")))
        self.assertFalse(any(root.glob("apps/*/Salim/Resources/cameras.csv")))


if __name__ == "__main__":
    unittest.main()
