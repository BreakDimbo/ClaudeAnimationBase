# Remove stray islands from the cut-out sprites (flecks of card background left beside shoulders and feet):
# keep only alpha components at least 1.5% the size of the largest one. Idempotent; run before tools/pack.mjs.
import glob, numpy as np
from PIL import Image
from scipy import ndimage
for f in sorted(glob.glob('sprites/*_main.png') + glob.glob('sprites/*_back.png') + glob.glob('sprites/*_front.png')):
    im = np.array(Image.open(f).convert('RGBA')); a = im[..., 3] > 20
    lab, n = ndimage.label(a)
    if n <= 1: continue
    sizes = ndimage.sum(a, lab, range(1, n + 1)); keep = sizes >= sizes.max() * .015
    mask = keep[lab - 1] & a
    removed = int(a.sum() - mask.sum())
    if removed:
        im[..., 3] = np.where(mask, im[..., 3], 0); Image.fromarray(im).save(f)
        print(f, n, 'islands, removed', removed, 'px')

# Card-white fringe still attached to dark figures (beside hair, along trouser legs): near-white, colourless
# patches touching the outside that are small. Only for cards without white clothing.
for k in ['02', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16']:
    f = f'sprites/{k}_main.png'; im = np.array(Image.open(f).convert('RGBA')).astype(np.int32)
    rgb = im[..., :3]; a = im[..., 3] > 20
    mx, mn = rgb.max(-1), rgb.min(-1); light = (mx > 200) & ((mx - mn) < 34) & a
    outside = ndimage.binary_dilation(~a, iterations=2)
    lab, n = ndimage.label(light)
    if not n: continue
    touch = ndimage.maximum(outside, lab, range(1, n + 1)); sizes = ndimage.sum(light, lab, range(1, n + 1))
    kill = (touch > 0) & (sizes < 6000)
    m = kill[lab - 1] & light
    m = ndimage.binary_dilation(m, iterations=1) & a
    if m.sum():
        im[..., 3] = np.where(m, 0, im[..., 3]); Image.fromarray(im.astype(np.uint8)).save(f); print(f, 'fringe removed', int(m.sum()), 'px')
