"""Cut the Dr Pharmacist logo off its white background and make animation layers.

Usage: python3 scripts/brand_assets.py public/brand/logo_original.jpg public/brand
"""
import sys

import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.float32)
NAVY = np.array([27, 79, 150], np.float32)
TEAL = np.array([38, 166, 186], np.float32)
WHITE = np.array([255, 255, 255], np.float32)


def unmix(target):
    # alpha such that pixel = alpha*target + (1-alpha)*white, least squares per pixel
    d = WHITE - target
    a = ((WHITE - rgb) @ d) / (d @ d)
    return np.clip(a, 0, 1)


a_navy, a_teal = unmix(NAVY), unmix(TEAL)
# Which ink is this pixel? Compare reconstruction error.
err_n = np.linalg.norm(rgb - (a_navy[..., None] * NAVY + (1 - a_navy[..., None]) * WHITE), axis=2)
err_t = np.linalg.norm(rgb - (a_teal[..., None] * TEAL + (1 - a_teal[..., None]) * WHITE), axis=2)
is_teal = err_t < err_n
alpha = np.where(is_teal, a_teal, a_navy)
alpha = np.where(alpha < 0.04, 0, alpha)
alpha = np.clip((alpha - 0.04) / 0.9, 0, 1)

H, W = alpha.shape
ys, xs = np.nonzero(alpha > 0.05)
mark_bottom = 760  # the DP monogram sits above the wordmark


def save(name, colors, mask, box):
    x0, y0, x1, y1 = box
    img = np.zeros((H, W, 4), np.uint8)
    img[..., :3] = colors
    img[..., 3] = (alpha * mask * 255).astype(np.uint8)
    Image.fromarray(img[y0:y1, x0:x1]).save(f"{out}/{name}.png")


def bbox(mask):
    yy, xx = np.nonzero((alpha > 0.05) & mask)
    return xx.min() - 6, yy.min() - 6, xx.max() + 7, yy.max() + 7


rows = np.arange(H)[:, None] * np.ones((1, W))
mark = rows < mark_bottom
word = ~mark
full_box = bbox(np.ones_like(mark, bool))
mark_box = bbox(mark)
word_box = bbox(word)

colors_orig = np.where(is_teal[..., None], TEAL, NAVY)
on_dark = np.where(is_teal[..., None], np.array([47, 196, 214]), np.array([255, 255, 255]))

save("logo_color", colors_orig, 1.0, full_box)
save("logo_on_dark", on_dark, 1.0, full_box)
save("mark_D", on_dark, (mark & ~is_teal), mark_box)
save("mark_P", on_dark, (mark & is_teal), mark_box)
save("mark_color", colors_orig, mark, mark_box)
save("wordmark_on_dark", on_dark, word, word_box)
print("full", full_box, "mark", mark_box, "word", word_box)
