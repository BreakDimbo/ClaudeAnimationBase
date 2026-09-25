# Contact strip from rendered frames: python3 tools/strip.py a b step out.jpg [cols]
import sys
from PIL import Image, ImageDraw
a, b, st, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]; cols = int(sys.argv[5]) if len(sys.argv) > 5 else 6
ts = []; t = a
while t <= b + 1e-6: ts.append(round(t, 3)); t += st
W, H = 320, 180; rows = (len(ts) + cols - 1) // cols
o = Image.new('RGB', (cols * (W + 6) + 6, rows * (H + 22) + 6), (29, 33, 56)); d = ImageDraw.Draw(o)
for i, t in enumerate(ts):
    im = Image.open('build/frames/f%05d.jpg' % min(4319, round(t * 24))).resize((W, H))
    x = 6 + (i % cols) * (W + 6); y = 6 + (i // cols) * (H + 22); o.paste(im, (x, y + 16)); d.text((x + 2, y + 2), '%.2fs' % t, fill=(239, 230, 210))
o.save(out, quality=86)
