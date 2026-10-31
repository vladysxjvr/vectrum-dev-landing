import re
import statistics
import sys

vid, s0300, raw, blur, yraw = sys.argv[1:6]


def seam_stats(path):
    # line i (0-based) compares frame i+1 with frame i; seams are 299->300 and 599->600
    v = [float(re.search(r'All:([0-9.]+)', l).group(1)) for l in open(path)]
    seams = [v[299], v[599]]
    others = [x for i, x in enumerate(v) if i not in (299, 599)]
    return f"seam={min(seams):.5f}  median={statistics.median(others):.5f}  min={min(others):.5f}"


b = open(yraw, 'rb').read()
W, H = 500, 420
best = 0
for y in range(H):
    row = b[y * W:(y + 1) * W]
    run = 1
    for x in range(1, W):
        run = run + 1 if row[x] == row[x - 1] else 1
        best = max(best, run)
prof = [sum(b[y * W + x] for y in range(H)) / H for x in range(W)]
step = max(abs(prof[i + 1] - prof[i]) for i in range(W - 1))

print(vid)
print(f"  SSIM frame0 vs frame300 (p=1.0):  {s0300}")
print(f"  neighbour SSIM, x3 concat, raw:   {seam_stats(raw)}")
print(f"  neighbour SSIM, grain blurred:    {seam_stats(blur)}")
print(f"  banding top-left 500x420: longest flat luma run={best}px, max profile step={step:.2f} levels, luma {min(b)}-{max(b)}")
