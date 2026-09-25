# Cut figures out of the character cards: flood-fill the paper background from the card edges,
# then label the remaining blobs and draw their boxes so the views can be picked by number.
#   python3 tools/segment.py <card.png> <preview.jpg>   → prints blobs: id x0 y0 x1 y1 area
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

def paper_mask(rgb, tol=20):
    h, w, _ = rgb.shape
    edge = np.concatenate([rgb[:8].reshape(-1, 3), rgb[-8:].reshape(-1, 3), rgb[:, :8].reshape(-1, 3), rgb[:, -8:].reshape(-1, 3)])
    bg = np.median(edge, 0)
    d = np.sqrt(((rgb.astype(float) - bg) ** 2).sum(-1))
    sat = rgb.max(-1).astype(int) - rgb.min(-1)
    cand = (d < tol) & (sat < 40)
    lab, n = ndi.label(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    # every large paper-coloured region is background (panels are separated by thin rules, so most are not border-connected)
    sizes = ndi.sum(np.ones_like(lab), lab, range(1, n + 1))
    big = {i + 1 for i, s in enumerate(sizes) if s > 3000}
    return np.isin(lab, list(border | big)), bg

def blobs(fg, min_area=6000):
    fg = ndi.binary_opening(fg, iterations=1)
    lab, n = ndi.label(ndi.binary_dilation(fg, iterations=3))
    out = []
    for i, sl in enumerate(ndi.find_objects(lab)):
        area = int((lab[sl] == i + 1).sum())
        if area >= min_area: out.append((i + 1, sl[1].start, sl[0].start, sl[1].stop, sl[0].stop, area))
    return lab, out

if __name__ == '__main__':
    im = Image.open(sys.argv[1]).convert('RGB'); rgb = np.asarray(im)
    bgm, bg = paper_mask(rgb)
    lab, bl = blobs(~bgm)
    pv = im.copy(); ov = np.asarray(pv).copy(); ov[bgm] = (ov[bgm] * .35 + np.array([40, 60, 120]) * .65).astype(np.uint8)
    pv = Image.fromarray(ov); dr = ImageDraw.Draw(pv)
    for (i, x0, y0, x1, y1, a) in bl:
        dr.rectangle([x0, y0, x1, y1], outline=(255, 0, 0), width=3); dr.text((x0 + 6, y0 + 4), str(i), fill=(255, 0, 0), font=ImageFont.load_default(size=40))
        print(i, x0, y0, x1, y1, a)
    pv.save(sys.argv[2], quality=85)
