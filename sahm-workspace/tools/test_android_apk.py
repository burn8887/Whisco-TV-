import struct
import unittest
from check_android_apk import load_alignments

class ElfAlignmentTests(unittest.TestCase):
    def elf(self,align):
        data=bytearray(120);data[:6]=b'\x7fELF\x02\x01'
        struct.pack_into('<Q',data,32,64);struct.pack_into('<HH',data,54,56,1)
        struct.pack_into('<I',data,64,1);struct.pack_into('<Q',data,112,align)
        return data
    def test_accepts_16_and_64_kib(self):
        for n in (16384,65536):self.assertEqual(load_alignments(self.elf(n)),[n])
    def test_rejects_4_kib(self):
        with self.assertRaises(ValueError):load_alignments(self.elf(4096))
    def test_rejects_non_power_of_two(self):
        with self.assertRaises(ValueError):load_alignments(self.elf(20000))
    def test_rejects_truncated_and_invalid_header(self):
        for data in (b'',b'not ELF',self.elf(16384)[:100]):
            with self.assertRaises(ValueError):load_alignments(data)
