"""Render a Short on Windows (or anywhere) without the long-path traps, with motion blur and the audio muxed in.

Why: on Windows, a project in a deep folder makes Remotion's bundled Chrome and ffmpeg fail to start (MAX_PATH,
`spawn ... ENOENT`). This script copies the headless shell to a short temp path once, renders the `<Comp>Sub`
composition (SUB=4 sub-frames per frame) as a JPEG sequence, averages it with ffmpeg tmix (180° shutter), and muxes
the mix. Use a short project path anyway (C:\\videos\\<name>) when you can.

Usage: python -I render_win.py <project-dir> <CompId> <out.mp4> [--audio mix.wav] [--no-blur] [--scale 1]
       [--concurrency 3]
Needs: node/npx, ffmpeg on PATH.
"""
import argparse
import os
import pathlib
import shutil
import subprocess
import sys
import tempfile


def short_browser(project: pathlib.Path) -> str | None:
    src = project / "node_modules" / ".remotion" / "chrome-headless-shell"
    exe = list(src.rglob("chrome-headless-shell.exe")) or list(src.rglob("chrome-headless-shell"))
    if not exe:
        subprocess.run("npx remotion browser ensure", cwd=project, shell=True, check=True)
        exe = list(src.rglob("chrome-headless-shell.exe")) or list(src.rglob("chrome-headless-shell"))
    if not exe:
        return None
    if len(str(exe[0])) < 200:
        return str(exe[0])
    dst = pathlib.Path(tempfile.gettempdir()) / "rchs"
    if not (dst / exe[0].name).exists():
        shutil.copytree(exe[0].parent, dst, dirs_exist_ok=True)
    return str(dst / exe[0].name)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("comp")
    ap.add_argument("out")
    ap.add_argument("--audio")
    ap.add_argument("--no-blur", action="store_true")
    ap.add_argument("--scale", default="1")
    ap.add_argument("--concurrency", default="3")
    a = ap.parse_args()
    project = pathlib.Path(a.project).resolve()
    out = pathlib.Path(a.out).resolve()
    seq = out.parent / (out.stem + "_seq")
    shutil.rmtree(seq, ignore_errors=True)
    comp = a.comp if a.no_blur else a.comp + "Sub"
    cmd = ["npx", "remotion", "render", "src/index.ts", comp, str(seq), "--sequence", "--image-format=jpeg", "--jpeg-quality=95",
           f"--scale={a.scale}", "--gl=angle", "--timeout=240000", f"--concurrency={a.concurrency}"]
    b = short_browser(project)
    if b:
        cmd.append(f"--browser-executable={b}")
    print(" ".join(cmd))
    if subprocess.run(" ".join(f'"{c}"' if " " in c else c for c in cmd), cwd=project, shell=True).returncode:
        return 1
    frames = sorted(seq.glob("element-*.jpeg"))
    digits = len(frames[0].stem.split("-")[1])
    pattern = str(seq / f"element-%0{digits}d.jpeg")
    video = out.with_name(out.stem + "_video.mp4") if a.audio else out
    vf = ["-vf", "tmix=frames=4:weights='1 1 1 1',select='eq(mod(n\\,4)\\,3)',setpts=N/30/TB"] if not a.no_blur else []
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30" if a.no_blur else "120", "-i", pattern, *vf,
                    "-r", "30", "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(video)], check=True)
    if a.audio:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(video), "-i", a.audio, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
                        "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", str(out)], check=True)
    shutil.rmtree(seq, ignore_errors=True)
    print("wrote", out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
