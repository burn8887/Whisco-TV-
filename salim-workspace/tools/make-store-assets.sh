#!/usr/bin/env bash
# Regenerate the Play / App Store feature graphic.
#
# The graphic is built from the same tokens as the app — near-black ground, one signal
# colour, monospaced labels, hairline rules — so the store listing and the product do not
# look like two different companies. It is generated rather than hand-drawn in an editor so
# that a wording change is a one-line diff, not a lost source file.
#
# Output: docs/store-feature-1024x500.png
#   Play requires PNG or JPEG, 1024x500, no transparency, at most 1 MB.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CAPSULE="$(dirname "$HERE")"
ICON="$CAPSULE/docs/store-icon-512.png"
OUT="$CAPSULE/docs/store-feature-1024x500.png"

command -v convert >/dev/null || { echo "ImageMagick is required (convert not found)" >&2; exit 1; }
[ -f "$ICON" ] || { echo "missing $ICON" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

convert "$ICON" -resize 64x64 "$TMP/mark.png"

# Kerning persists across -annotate calls in ImageMagick, so every block resets it. Getting
# this wrong once letter-spaced the entire graphic.
convert -size 1024x500 xc:'#0A0D0B' \
  "$TMP/mark.png" -geometry +96+52 -composite \
  -font DejaVu-Sans-Mono-Bold -fill '#E9F1EA' -pointsize 26 -kerning 9 -annotate +180+96 "SALIM" \
  -kerning 0 -fill '#4ADE9B' -draw "rectangle 96,136 156,138" \
  -font DejaVu-Sans-Bold -fill '#E9F1EA' -pointsize 46 -annotate +96+212 "Know what's ahead." \
  -fill '#4ADE9B' -annotate +96+266 "Keep your calm." \
  -font DejaVu-Sans -fill '#94A79B' -pointsize 19 -annotate +96+318 "Speed, seatbelt and red-light camera alerts." \
  -annotate +96+346 "Bahrain first, the Gulf next." \
  -font DejaVu-Sans-Mono-Bold -fill '#4ADE9B' -pointsize 12 -kerning 3 -annotate +96+406 "AWARE, NOT ALARMED" \
  -font DejaVu-Sans-Mono -fill '#4E5E54' -pointsize 12 -kerning 2 -annotate +96+434 "SALIMDRIVE.COM" \
  -kerning 0 -fill '#1A211D' -draw "roundrectangle 664,96 960,404 10,10" \
  -fill none -stroke '#27332C' -strokewidth 1 -draw "roundrectangle 664,96 960,404 10,10" \
  -fill '#4ADE9B' -stroke none -draw "rectangle 664,96 960,98" \
  -font DejaVu-Sans-Mono -fill '#4ADE9B' -pointsize 12 -kerning 3 -annotate +700+140 "GPS TEST" \
  -kerning 0 -font DejaVu-Sans-Mono-Bold -fill '#E9F1EA' -pointsize 132 -annotate +692+280 "80" \
  -font DejaVu-Sans-Mono-Bold -fill '#4ADE9B' -pointsize 15 -kerning 4 -annotate +700+316 "KM/H" \
  -kerning 0 -fill '#27332C' -draw "rectangle 700,344 924,345" \
  -font DejaVu-Sans-Mono -fill '#94A79B' -pointsize 12 -kerning 2 -annotate +700+372 "SEATBELT CAMERA · 520 M" \
  -kerning 0 -depth 8 -alpha off -strip "$OUT"

python3 - "$OUT" <<'PY'
import struct, sys
path = sys.argv[1]
data = open(path, "rb").read()
width, height = struct.unpack(">II", data[16:24])
colour_type = data[25]
assert (width, height) == (1024, 500), f"wrong size {width}x{height}"
assert colour_type in (2, 3), f"colour type {colour_type} may carry alpha"
assert len(data) <= 1_000_000, f"{len(data)} bytes exceeds Play's 1 MB limit"
print(f"store-feature-1024x500.png: {width}x{height}, {len(data) // 1024} KB, alpha-free")
PY
