import importlib.util
from pathlib import Path
import tempfile
import unittest
spec = importlib.util.spec_from_file_location('materialize', Path(__file__).with_name('materialize.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class MaterializerTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.host = self.root / 'host'
        self.source = self.host / 'sahm-workspace'
        self.source.mkdir(parents=True)
        self.output = self.root / 'runtime'
        (self.source / 'demo.ts.source').write_text('export const demo = true;')
    def tearDown(self):
        self.temp.cleanup()
    def copy(self):
        return module.materialize(self.source, self.output, self.host)
    def test_repeatable_extension_restoration(self):
        self.copy(); self.copy()
        self.assertEqual((self.output / 'demo.ts').read_text(), 'export const demo = true;')
    def test_host_is_protected(self):
        with self.assertRaises(ValueError): module.materialize(self.source, self.host / 'runtime', self.host)
    def test_unrelated_directory_is_protected(self):
        self.output.mkdir(); (self.output / 'other').write_text('protected')
        with self.assertRaises(ValueError): self.copy()
        self.assertEqual((self.output / 'other').read_text(), 'protected')
    def test_runtime_edits_are_protected(self):
        self.copy(); (self.output / 'demo.ts').write_text('user edit')
        (self.source / 'new.ts.source').write_text('new')
        with self.assertRaises(ValueError): self.copy()
        self.assertFalse((self.output / 'new.ts').exists())
    def test_dependencies_not_copied_or_deleted(self):
        (self.source / 'node_modules').mkdir(); (self.source / 'node_modules/x.js').write_text('dependency')
        self.copy(); self.assertFalse((self.output / 'node_modules').exists())
        (self.output / 'node_modules').mkdir(); (self.output / 'node_modules/x').write_text('installed')
        self.copy(); self.assertTrue((self.output / 'node_modules/x').exists())
    def test_symlink_is_blocked(self):
        self.copy(); (self.output / 'demo.ts').unlink(); (self.output / 'demo.ts').symlink_to(self.source / 'demo.ts.source')
        with self.assertRaises(ValueError): self.copy()
    def test_only_stale_managed_files_removed(self):
        self.copy(); (self.source / 'demo.ts.source').unlink(); self.copy()
        self.assertFalse((self.output / 'demo.ts').exists())
    def test_secrets_excluded(self):
        (self.source / '.env.production').write_text('private'); self.copy()
        self.assertFalse((self.output / '.env.production').exists())

if __name__ == '__main__': unittest.main()
