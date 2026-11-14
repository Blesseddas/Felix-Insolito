"""Build a Short's sound: synthesized story SFX on exact times + a soft music pad ducked under the VO, every cue
leveled against the voice, two-pass loudnorm to -14 LUFS / -1 dBTP. Everything is generated with ffmpeg, so there
is no music or SFX license to worry about.

cues.json:
  {"dur": 10.9,
   "music": {"chords": [[0, "am"], [6.9, "f"]], "peak": -22},
   "cues": [{"t": 0.15, "type": "drill"}, {"t": 1.18, "type": "tick"}, {"t": 2.3, "type": "whoosh", "len": 0.45},
            {"t": 3.55, "type": "boing"}, {"t": 4.6, "type": "crickets", "len": 2.3},
            {"t": 8.15, "type": "fuse", "len": 1.9}, {"t": 10.05, "type": "boom"}]}
Cue types: drill, tick, whoosh, boing, crickets, fuse, boom, thud, ding. Optional per cue: "peak" (dBFS target).

Usage: python -I audio_mix.py vo.wav cues.json out.wav [--workdir audio/_sfx]
"""
import argparse
import json
import pathlib
import re
import subprocess

SR = 48000
CHORDS = {  # root triads + a bass note (Hz)
    "am": [220.0, 261.63, 329.63, 110.0], "f": [174.61, 220.0, 261.63, 87.31], "c": [261.63, 329.63, 392.0, 130.81],
    "g": [196.0, 246.94, 293.66, 98.0], "dm": [146.83, 174.61, 220.0, 73.42], "em": [164.81, 196.0, 246.94, 82.41],
}
# default target peaks (dBFS) for a VO peaking near -6: one-shots ~8-10 dB under it, beds far under
PEAK = {"drill": -15, "tick": -16, "whoosh": -16, "boing": -15, "crickets": -32, "fuse": -17, "boom": -12, "thud": -13, "ding": -17}


def ff(*a: str) -> str:
    r = subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *a], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr)
    return r.stderr


def peak(path: str) -> float:
    out = subprocess.run(["ffmpeg", "-i", path, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"max_volume: (-?[\d.]+)", out)
    return float(m.group(1)) if m else -90.0


def synth(kind: str, ln: float, out: str) -> None:
    if kind == "drill":
        d = ln or 0.75
        ff("-f", "lavfi", "-i", f"aevalsrc='0.5*sin(2*PI*210*t)*(0.55+0.45*sin(2*PI*32*t))+0.25*sin(2*PI*420*t)':s={SR}:d={d}",
           "-f", "lavfi", "-i", f"anoisesrc=c=pink:r={SR}:d={d}:a=0.4",
           "-filter_complex", f"[1]bandpass=f=1400:width_type=h:w=900[n];[0][n]amix=inputs=2:normalize=0,afade=t=in:d=0.05,afade=t=out:st={d - 0.13}:d=0.13", out)
    elif kind == "tick":
        ff("-f", "lavfi", "-i", f"aevalsrc='sin(2*PI*1900*t)*exp(-60*t)':s={SR}:d=0.12", out)
    elif kind == "ding":
        ff("-f", "lavfi", "-i", f"aevalsrc='(sin(2*PI*1568*t)+0.5*sin(2*PI*3136*t))*exp(-5*t)':s={SR}:d=0.9", out)
    elif kind == "whoosh":
        d = ln or 0.6
        ff("-f", "lavfi", "-i", f"anoisesrc=c=pink:r={SR}:d={d}:a=0.9",
           "-af", f"bandpass=f=900:width_type=h:w=1400,afade=t=in:d={d * 0.55}:curve=qsin,afade=t=out:st={d * 0.55}:d={d * 0.45}:curve=qsin", out)
    elif kind == "boing":
        ff("-f", "lavfi", "-i", f"aevalsrc='sin(2*PI*(260*t+55*sin(2*PI*7*t)+120*t*t))*exp(-3.2*t)':s={SR}:d=0.8", out)
    elif kind == "crickets":
        d = ln or 2.0
        ff("-f", "lavfi", "-i", f"aevalsrc='0.35*sin(2*PI*4600*t)*gt(sin(2*PI*21*t),0)*gt(sin(2*PI*1.6*t),0.35)+0.25*sin(2*PI*5200*t)*gt(sin(2*PI*19*t),0)*gt(sin(2*PI*1.1*t+1),0.5)':s={SR}:d={d}",
           "-af", f"afade=t=in:d=0.3,afade=t=out:st={max(0.0, d - 0.4)}:d=0.4", out)
    elif kind == "fuse":
        d = ln or 1.5
        ff("-f", "lavfi", "-i", f"anoisesrc=c=white:r={SR}:d={d}:a=0.6",
           "-af", f"highpass=f=3500,volume='0.25+0.75*t/{d}':eval=frame,afade=t=in:d=0.2,tremolo=f=13:d=0.5", out)
    elif kind in ("boom", "thud"):
        d, f0, k = (0.85, 58, 4) if kind == "boom" else (0.4, 90, 9)
        ff("-f", "lavfi", "-i", f"aevalsrc='0.9*sin(2*PI*({f0}*t-25*t*t))*exp(-{k}*t)':s={SR}:d={d}",
           "-f", "lavfi", "-i", f"anoisesrc=c=brown:r={SR}:d={d}:a=0.8",
           "-filter_complex", f"[1]lowpass=f=600,afade=t=out:st=0.05:d={d - 0.05}[n];[0][n]amix=inputs=2:normalize=0", out)
    else:
        raise ValueError(f"unknown cue type {kind}")


def music(chords: list, dur: float, out: str) -> None:
    terms = []
    for i, (t0, name) in enumerate(chords):
        t1 = chords[i + 1][0] if i + 1 < len(chords) else dur + 1
        a, b, c, bass = CHORDS[name]
        terms.append(f"(sin(2*PI*{a}*t)+0.7*sin(2*PI*{b}*t)+0.6*sin(2*PI*{c}*t)+0.3*sin(2*PI*{bass}*t))*between(t,{t0},{t1})")
    ff("-f", "lavfi", "-i", f"aevalsrc='{'+'.join(terms)}':s={SR}:d={dur}",
       "-af", f"volume=0.12,tremolo=f=0.6:d=0.3,lowpass=f=1800,afade=t=in:d=0.4,afade=t=out:st={dur - 0.6}:d=0.6", out)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("vo")
    ap.add_argument("cues")
    ap.add_argument("out")
    ap.add_argument("--workdir", default=None)
    a = ap.parse_args()
    spec = json.load(open(a.cues, encoding="utf-8"))
    dur = float(spec["dur"])
    wd = pathlib.Path(a.workdir or pathlib.Path(a.out).parent / "_sfx")
    wd.mkdir(parents=True, exist_ok=True)
    inputs, chains, labels = ["-i", a.vo], [f"[0]apad=whole_dur={dur},asplit=2[vo][sc]"], ["[vo]"]
    m = spec.get("music")
    if m:
        mp = str(wd / "music.wav")
        music(m.get("chords", [[0, "am"]]), dur, mp)
        inputs += ["-i", mp]
        g = m.get("peak", -22) - peak(mp)
        chains.append(f"[1]volume={g:.2f}dB[mu0];[mu0][sc]sidechaincompress=threshold=0.03:ratio=3:attack=20:release=400:makeup=1[mu]")
        labels.append("[mu]")
    else:
        chains.append("[sc]anullsink")
    for i, c in enumerate(spec["cues"]):
        p = str(wd / f"cue{i:02d}_{c['type']}.wav")
        synth(c["type"], float(c.get("len", 0)), p)
        idx = len(inputs) // 2
        inputs += ["-i", p]
        g = c.get("peak", PEAK[c["type"]]) - peak(p)
        chains.append(f"[{idx}]volume={g:.2f}dB,adelay={int(round(float(c['t']) * 1000))}:all=1[c{i}]")
        labels.append(f"[c{i}]")
    chains.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0:duration=first,atrim=0:{dur}[mix]")
    pre = str(wd / "mix_pre.wav")
    ff(*inputs, "-filter_complex", ";".join(chains), "-map", "[mix]", "-ar", str(SR), pre)
    meas = subprocess.run(["ffmpeg", "-i", pre, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
    j = json.loads(meas[meas.rindex("{"): meas.rindex("}") + 1])
    ff("-i", pre, "-af",
       f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true",
       "-ar", str(SR), a.out)
    print("wrote", a.out)


if __name__ == "__main__":
    main()
