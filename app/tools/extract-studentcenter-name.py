"""Trace the visible mounted letters from the native PKU entrance photograph.

Usage: python extract-studentcenter-name.py SOURCE_JPEG OUTPUT_JS
Requires Pillow and numpy. No font substitution, synthesis, or source upscaling.
"""
import hashlib
import json
import sys
from pathlib import Path
import numpy as np
from PIL import Image

source, output = map(Path, sys.argv[1:])
im = Image.open(source).convert('RGB')
assert im.size == (1661, 1107), 'Use the original 1661 x 1107 official photograph'
# Separate windows exclude masonry joints between the seven letters.
windows = [(614, 430, 649, 466), (680, 429, 722, 465),
           (752, 435, 786, 464), (814, 429, 852, 466),
           (879, 431, 916, 465), (944, 428, 978, 466),
           (1008, 437, 1045, 463)]
rects = []
for x0, y0, x1, y1 in windows:
    pixels = np.asarray(im)[y0:y1, x0:x1].astype(float)
    lum = pixels @ np.array([.2126, .7152, .0722])
    # Native dark strokes; no adaptive enhancement that might invent thin marks.
    mask = lum < 142
    # Remove isolated JPEG/masonry flecks, retaining disconnected calligraphic dots.
    seen = set()
    for y, x in zip(*np.nonzero(mask)):
        if (y, x) in seen:
            continue
        component, todo = [], [(y, x)]
        seen.add((y, x))
        while todo:
            py, px = todo.pop()
            component.append((py, px))
            for dy in [-1, 0, 1]:
                for dx in [-1, 0, 1]:
                    q = (py + dy, px + dx)
                    if (0 <= q[0] < mask.shape[0] and 0 <= q[1] < mask.shape[1]
                            and mask[q] and q not in seen):
                        seen.add(q)
                        todo.append(q)
        if len(component) < 3:
            for q in component:
                mask[q] = False
    active = {}
    for y, row in enumerate(mask):
        runs, x = [], 0
        while x < len(row):
            if not row[x]:
                x += 1
                continue
            start = x
            while x < len(row) and row[x]:
                x += 1
            runs.append((start, x-start))
        for key in list(active):
            if key not in runs:
                rects.append(active.pop(key))
        for key in runs:
            if key in active:
                active[key][3] += 1
            else:
                active[key] = [x0 + key[0], y0 + y, key[1], 1]
    rects.extend(active.values())
data = dict(text='新太阳学生中心', nativeSize=list(im.size),
            sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
            source='https://scc.pku.edu.cn/userfiles/22e90345830e61cc01831266fda405f6/images/cms/article/2025/09/image-20250901104041-1.jpeg',
            windows=windows, rects=rects)
output.write_text('/* Photo-traced native strokes; regenerate with extract-studentcenter-name.py. */\nYY.StudentCenter195NameTrace=' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(json.dumps({'rectangles':len(rects), 'sourceSHA256': data['sha256']}))
