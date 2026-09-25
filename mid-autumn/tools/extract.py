# Cut every view out of the character cards into transparent PNG sprites (sprites/<card>_<view>.png).
# Background = paper colour or near-white wash, flood-filled from the crop's own edges, so enclosed
# light clothing stays. Small detached bits (printed labels, stray strokes) are dropped.
import json, sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

BOX = json.load(open('tools/boxes.json'))

def cut(rgb, box, keep=1):
    x0, y0, x1, y1 = box
    h, w, _ = rgb.shape
    x0, y0, x1, y1 = max(0, x0 - 4), max(0, y0 - 4), min(w, x1 + 4), min(h, y1 + 4)
    c = rgb[y0:y1, x0:x1].astype(float)
    edge = np.concatenate([c[:3].reshape(-1, 3), c[-3:].reshape(-1, 3), c[:, :3].reshape(-1, 3), c[:, -3:].reshape(-1, 3)])
    bg = np.median(edge, 0)
    d = np.sqrt(((c - bg) ** 2).sum(-1))
    sat = c.max(-1) - c.min(-1)
    light = (c.min(-1) > 214) & (sat < 26)
    cand = ((d < 22) & (sat < 40)) | light
    cand = ndi.binary_opening(cand, iterations=1) | (d < 8)
    lab, n = ndi.label(cand)
    edge_ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bgm = np.isin(lab, list(edge_ids))
    # enclosed holes that are plainly paper (between arm and body): very close to paper, large
    for i in range(1, n + 1):
        if i in edge_ids: continue
        m = lab == i
        a = m.sum()
        if a > 250 and d[m].mean() < 10: bgm |= m
    fg = ~bgm
    fg = ndi.binary_opening(fg, iterations=1)
    lab, n = ndi.label(fg)
    sizes = ndi.sum(fg, lab, range(1, n + 1))
    order = np.argsort(sizes)[::-1]
    alpha = np.zeros(fg.shape, bool)
    big = sizes[order[0]] if n else 0
    kept = [order[k] + 1 for k in range(min(keep, n))]
    for k in kept: alpha |= lab == k
    # re-attach nearby pieces of the kept figure (hair wisps, fingers) that are not tiny
    near = ndi.binary_dilation(alpha, iterations=6)
    for i in range(1, n + 1):
        if i in kept: continue
        if sizes[i - 1] > 60 and (near & (lab == i)).any(): alpha |= lab == i
    alpha = ndi.binary_fill_holes(alpha) & ~bgm | (alpha)
    a = ndi.gaussian_filter(alpha.astype(float), .7)
    return c, a, (x0, y0)

def save(c, a, path):
    ys, xs = np.where(a > .05)
    if len(xs) == 0: return None
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    rgba = np.dstack([c, a * 255]).astype(np.uint8)[y0:y1, x0:x1]
    Image.fromarray(rgba, 'RGBA').save(path, optimize=True)
    return [int(x1 - x0), int(y1 - y0)]

if __name__ == '__main__':
    import os; os.makedirs('sprites', exist_ok=True)
    only = sys.argv[1:]
    meta = {}
    for card, views in BOX.items():
        if only and card not in only: continue
        rgb = np.asarray(Image.open(f'cards/c{card}.png').convert('RGB'))
        for view, box in views.items():
            if view == 'expr':
                c, a, _ = cut(rgb, box, keep=3)
                lab, n = ndi.label(a > .5)
                sz = ndi.sum(a > .5, lab, range(1, n + 1)); top = np.argsort(sz)[::-1][:3] + 1
                sl = sorted([ndi.find_objects(lab)[t - 1] for t in top], key=lambda s: (s[0].start // 120, s[1].start))
                for k, s in enumerate(sl):
                    m = np.zeros_like(a); m[s] = a[s] * (ndi.binary_dilation(lab == lab[s][lab[s] > 0][0], iterations=2)[s] if False else 1)
                    meta[f'{card}_e{k}'] = save(c, m, f'sprites/{card}_e{k}.png')
            else:
                c, a, _ = cut(rgb, box)
                meta[f'{card}_{view}'] = save(c, a, f'sprites/{card}_{view}.png')
        print(card, 'done')
    json.dump(meta, open('sprites/meta_partial.json', 'w'))
