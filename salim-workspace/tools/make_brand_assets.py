import cairosvg, io
from PIL import Image
INK="#0A0D0B"; CREAM="#F4EFE6"; GREEN="#4ADE9B"; AMBER="#FFC24B"
def mark(color_lines=CREAM, color_dash=GREEN, color_dot=AMBER, ring_opacity=0.55):
    # Concept 1 on a 96-unit grid.
    return f'''
<line x1="18" y1="86" x2="43" y2="40" stroke="{color_lines}" stroke-width="4" stroke-linecap="round"/>
<line x1="78" y1="86" x2="53" y2="40" stroke="{color_lines}" stroke-width="4" stroke-linecap="round"/>
<line x1="48" y1="82" x2="48" y2="72" stroke="{color_dash}" stroke-width="3.5" stroke-linecap="round"/>
<line x1="48" y1="63" x2="48" y2="56" stroke="{color_dash}" stroke-width="3" stroke-linecap="round"/>
<line x1="48" y1="49" x2="48" y2="45" stroke="{color_dash}" stroke-width="2.5" stroke-linecap="round"/>
<circle cx="48" cy="22" r="10.5" fill="none" stroke="{color_dot}" stroke-width="2" stroke-opacity="{ring_opacity}"/>
<circle cx="48" cy="22" r="5.5" fill="{color_dot}"/>'''
def svg(size, bg=True, rounded=0, inner=None):
    inner = inner or mark()
    rect = f'<rect width="96" height="96" rx="{rounded}" fill="{INK}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 96 96">{rect}{inner}</svg>'
def png(svgtext, path):
    cairosvg.svg2png(bytestring=svgtext.encode(), write_to=path)
# Master + iOS (full-bleed, iOS applies its own mask; no alpha allowed)
open('salim-icon.svg','w').write(svg(1024, rounded=0))
open('salim-icon-rounded.svg','w').write(svg(1024, rounded=22))
png(svg(1024), 'ios-AppIcon.png')
im=Image.open('ios-AppIcon.png').convert('RGB'); im.save('ios-AppIcon.png')
# Store icon 512 (Play: full square, Play applies mask)
png(svg(512), 'store-icon-512.png'); Image.open('store-icon-512.png').convert('RGB').save('store-icon-512.png')
# Android adaptive foreground: 108dp viewport, mark scaled 0.7 around center of 66dp safe zone
fg_inner = f'<g transform="translate(54,56) scale(0.66) translate(-48,-50)">{mark()}</g>'
def fg_svg(px): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{px}" height="{px}" viewBox="0 0 108 108">{fg_inner}</svg>'
def legacy_svg(px): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{px}" height="{px}" viewBox="0 0 96 96"><rect width="96" height="96" rx="22" fill="{INK}"/>{mark()}</svg>'
for d,f in {'mdpi':1,'hdpi':1.5,'xhdpi':2,'xxhdpi':3,'xxxhdpi':4}.items():
    png(fg_svg(int(108*f)), f'fg-{d}.png'); png(legacy_svg(int(48*f)), f'legacy-{d}.png')
# preview composite
png(svg(256, rounded=22), 'preview-256.png')
print('ok')
