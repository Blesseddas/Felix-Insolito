"""Measure the "pop" look targets on frames: mean L*, chroma, share of highly saturated pixels, edge density (texture
noise), warm and cool shares. Only the area above the captions (top 62%) is measured.

Targets (inkbeat-pop): L* 50-56, chroma >= 40, saturated >= 35%, cool 15-30%, edges 6-9%.
Reference measured on a top 3D-cartoon story channel: L* 49, chroma 44, saturated 48%, cool 13%, edges 5.3%.

Usage: python -I measure_look.py <video.mp4 | folder-of-frames> [more ...]
Needs: numpy, Pillow, ffmpeg (for videos: samples 6 frames).
"""
import os
import subprocess
import sys
import tempfile

import numpy as np
from PIL import Image


def lab(rgb: np.ndarray):
    c = rgb / 255.0
    c = np.where(c > 0.04045, ((c + 0.055) / 1.055) ** 2.4, c / 12.92)
    m = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ m.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return 116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])


def frames_of(src: str) -> list[str]:
    if os.path.isdir(src):
        return [os.path.join(src, f) for f in sorted(os.listdir(src)) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
    d = tempfile.mkdtemp()
    # one representative frame per 40-frame batch, up to 6 frames
    subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", "thumbnail=40,scale=360:640", "-frames:v", "6",
                    "-fps_mode", "vfr", os.path.join(d, "f%02d.png")], check=True)
    return [os.path.join(d, f) for f in sorted(os.listdir(d))]


def measure(paths: list[str]):
    rows = []
    for p in paths:
        im = np.asarray(Image.open(p).convert("RGB").resize((225, 400))).astype(float)[: int(400 * 0.62)]
        L, a, b = lab(im)
        C = np.hypot(a, b)
        gy, gx = np.gradient(L)
        rows.append((L.mean(), C.mean(), (C > 45).mean(), (np.hypot(gx, gy) > 12).mean(), ((b > 15) & (a > 0)).mean(), (b < -8).mean()))
    return np.array(rows).mean(0)


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    for src in sys.argv[1:]:
        r = measure(frames_of(src))
        print(f"{os.path.basename(src)}: L*={r[0]:.0f} chroma={r[1]:.0f} saturated={r[2] * 100:.0f}% edges={r[3] * 100:.1f}% warm={r[4] * 100:.0f}% cool={r[5] * 100:.0f}%")
    return 0


if __name__ == "__main__":
    sys.exit(main())
