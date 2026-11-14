"""Phrase timings for a voice-over from its pauses (no aligner needed).

Give the VO audio and a text file with ONE PHRASE PER LINE, split where the narrator pauses (sentence ends and
strong commas). The script runs ffmpeg silencedetect, turns the gaps into speech spans, pairs them with the phrases
in order and prints a TypeScript PHRASES array to paste into the composition (words inside a phrase are spread by
length there). If the counts don't match it lists the spans so you can merge or split lines.

Usage: python -I vo_timing.py vo.wav phrases.txt [--noise -38] [--min-gap 0.12]
"""
import argparse
import re
import subprocess
import sys


def spans(wav: str, noise: float, gap: float) -> list[tuple[float, float]]:
    out = subprocess.run(
        ["ffmpeg", "-i", wav, "-af", f"silencedetect=noise={noise}dB:d={gap}", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    dur = float(re.search(r"Duration: (\d+):(\d+):([\d.]+)", out).group(3)) if "Duration" in out else 0.0
    m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", out)
    if m:
        dur = int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", out)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", out)]
    res, cur = [], 0.0
    for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends))):
        if s - cur > 0.05:
            res.append((round(cur + 0.02, 2), round(s, 2)))
        cur = e
    if dur - cur > 0.05:
        res.append((round(cur, 2), round(dur, 2)))
    return res


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("wav")
    ap.add_argument("phrases")
    ap.add_argument("--noise", type=float, default=-38)
    ap.add_argument("--min-gap", type=float, default=0.12)
    a = ap.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")  # Windows consoles default to cp1252 and break á, é, ñ
    phrases = [l.strip() for l in open(a.phrases, encoding="utf-8") if l.strip()]
    sp = spans(a.wav, a.noise, a.min_gap)
    if len(sp) != len(phrases):
        print(f"// {len(sp)} speech spans vs {len(phrases)} phrases: adjust the lines or --min-gap", file=sys.stderr)
        for s in sp:
            print(f"//   {s[0]:.2f}-{s[1]:.2f}", file=sys.stderr)
        return 1
    print("const PHRASES: [number, number, string][] = [")
    for (s, e), p in zip(sp, phrases):
        print(f'  [{s:.2f}, {e:.2f}, {p.lower()!r}],'.replace("'", '"'))
    print("];")
    return 0


if __name__ == "__main__":
    sys.exit(main())
