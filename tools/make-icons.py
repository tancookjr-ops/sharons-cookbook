#!/usr/bin/env python3
"""Generate Sharon's Cookbook PWA icons as PNGs (pure stdlib, no PIL).

Design: sage-green square, cream leaf (vesica-piscis lens) with a sage
midrib and short veins, small stem. Supersampled 3x for smooth edges.
"""
import struct, zlib, math, os

SAGE = (110, 139, 99)    # #6e8b63
SAGE_DEEP = (76, 102, 68)
CREAM = (250, 246, 239)  # #faf6ef

def leaf_mask(x, y, S, scale=1.0, cy_shift=-0.04):
    """Return True if point (in unit coords of size S) is inside the leaf."""
    cx, cy = 0.5 * S, (0.46 + cy_shift) * S
    h = 0.56 * S * scale   # leaf height
    w = 0.34 * S * scale   # leaf width
    # circle params from lens geometry
    Rma = w / 2.0                          # R - a
    Rpa = (h / 2.0) ** 2 / Rma             # R + a
    R = (Rma + Rpa) / 2.0
    a = R - Rma
    dx1 = x - (cx - a); dx2 = x - (cx + a); dy = y - cy
    return (dx1 * dx1 + dy * dy <= R * R) and (dx2 * dx2 + dy * dy <= R * R)

def stem_mask(x, y, S, scale=1.0):
    cx = 0.5 * S
    top = (0.46 + 0.20 * scale) * S
    bot = (0.46 + 0.34 * scale) * S
    return abs(x - cx) <= 0.016 * S * scale and top <= y <= bot

def midrib_mask(x, y, S, scale=1.0):
    cx, cy = 0.5 * S, 0.42 * S
    half_h = 0.24 * S * scale
    return abs(x - cx) <= 0.011 * S * scale and (cy - half_h) <= y <= (cy + half_h)

def vein_mask(x, y, S, scale=1.0):
    """Three angled veins per side."""
    cx, cy = 0.5 * S, 0.42 * S
    for i in range(3):
        vy = cy + (i - 1) * 0.115 * S * scale
        # vein: from (cx, vy) going up-out at 45°, length ~0.09S
        for sgn in (-1, 1):
            dx = (x - cx) * sgn
            dy = vy - y   # veins slope upward away from midrib
            if 0 <= dx <= 0.085 * S * scale:
                if abs(dy - dx * 0.55) <= 0.010 * S:
                    return True
    return False

def render(size, maskable=False, apple=False):
    SS = 3  # supersample factor
    S = size * SS
    scale = 0.74 if maskable else 1.0
    rows = []
    for py in range(size):
        row = bytearray()
        for px in range(size):
            r = g = b = 0
            for sy in range(SS):
                for sx in range(SS):
                    x = px * SS + sx + 0.5
                    y = py * SS + sy + 0.5
                    if leaf_mask(x, y, S, scale):
                        if midrib_mask(x, y, S, scale) or vein_mask(x, y, S, scale):
                            c = SAGE_DEEP
                        else:
                            c = CREAM
                    elif stem_mask(x, y, S, scale):
                        c = CREAM
                    else:
                        c = SAGE
                    r += c[0]; g += c[1]; b += c[2]
            n = SS * SS
            row += bytes((r // n, g // n, b // n))
        rows.append(bytes(row))
    return rows

def write_png(path, size, rows):
    raw = b''.join(b'\x00' + row for row in rows)
    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)  # 8-bit RGB
    png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr)
           + chunk(b'IDAT', zlib.compress(raw, 9)) + chunk(b'IEND', b''))
    with open(path, 'wb') as f:
        f.write(png)
    print(f'{path}: {len(png)} bytes')

# Output into the app's icons/ folder, wherever this repo lives.
out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'icons')
os.makedirs(out, exist_ok=True)
write_png(f'{out}/icon-512.png', 512, render(512))
write_png(f'{out}/icon-192.png', 192, render(192))
write_png(f'{out}/icon-maskable-512.png', 512, render(512, maskable=True))
write_png(f'{out}/apple-touch-icon.png', 180, render(180))
