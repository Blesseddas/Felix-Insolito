# The "pop" look (v2): what changed, the numbers, and the production loop

Built and measured against a top 3D-cartoon story channel on phone-size frames. The v1 look (ink, painted toon,
act lights) stays; v2 changes what reads in a feed at arm's length.

## Measured targets (run `scripts/measure_look.py` on every render)
| metric (top 62% of frame) | reference channel | v1 test | **v2 target** | v2 measured |
|---|---|---|---|---|
| mean L\* | 49 | 55 | 50–56 | 50–52 |
| chroma | 44 | 34 | **≥ 40** | 41 |
| highly saturated pixels (C > 45) | 48% | 16% | **≥ 35%** | 44–45% |
| cool pixels | 13% | 5% | **15–30%** | 24–31% |
| edge density (texture noise) | 5.3% | 12% | **6–9%** | 7.8–8.5% |

## The rules
1. **Color lives in the set paint, not in the grade.** Raising grade saturation on a cream/beige set *lowered* chroma
   (25→23). Paint walls, awnings, ground and props in saturated hues (cobalt `#2f6fe8`, tomato `#e8402a`, saffron
   `#ffc21a`, teal `#16b39a`, violet ground `#6a58c8`, sand sidewalk `#f2b56e`). Keep one cool surface in every
   framing (sky, a blue wall, the violet street).
2. **Mood `pop`** (`core/moods.ts`): strong cool fill `#6a9aff` 0.95, saturation 1.5, exposure 0.78, sharpen 0.22
   (0.45 turns painted texture into grime on a phone). Acts: `pop` hook/mockery → `night` tension (pass
   `exposure={-0.4}` to `<View>` and frame the sky + moon, or saturated sets read as day) → `golden` reveal.
3. **Pop characters:** `build.headScale` 1.45 adults, 1.6 kids, `limb` 1.1, `hand` 1.2–1.25; exaggerated faces
   (eyes `wide`/`squint`/`closed`, mouths `grin`/`o`/`smirk`, `sweat`).
4. **Stick limbs:** `<Character3D stick ... />` — thin black stick arms and legs (radius 0.0115 h), ball hands,
   oval black feet; torso, head, hair, hats unchanged. `stick={{ radius, color }}` to tune.
5. **Faces at 30–45% of frame height** (captions sit at 70%). Close-ups keep the head ~35–45% of frame width.
6. **Captions:** Panchang ExtraBold 80 px at 1080 wide (extended face: 80 reads like Poppins 92), white with a heavy
   dark stroke, **one** yellow accent `#ffd21a` per sentence (`accentColor="#ffd21a"`). Accent matching keeps
   accents (`verás` matches `verás,`). Panchang is downloaded per user by `scripts/get_panchang.py` (ITF FFL forbids
   bundling the font).
7. **In-world tag:** the story's key number painted on the key object (`Label`), visible in the hook.
8. **Emissive cores ≤ ~0.75 with a saturated color** (`#ff4a08`): at 1.0+ small glowing tips burn to cream.
9. **Moves:** one continuous camera path of keyed moves (see `demo/PopShort.tsx` `KEYS`), ease in-out, a 3%/s
   drift-push between moves; act light switches happen *inside* fast moves. Whips ≥ 0.45 s flag in `flicker.py`
   (acceptable on purpose); the skill's comfort floor is 0.85 s for big moves.
10. **Ending loop:** cut on the payoff ~0.7 s after the last word; no outro.

## Production loop for one Short (60 s ≈ 1.5–2 h render on a mid PC)
1. Script: hook with an absurd action + a number in the first sentence; mockery with a short quoted line; "pero…";
   "verás," at ~70% with a one-line everyday analogy; payoff and hard cut. ~200–220 words per 60 s.
2. Voice: `templates/audio/voice.json` (Liam, ×1.12 atempo). Save `vo_raw.mp3` → `vo.wav`.
3. Timing: one phrase per line in `phrases.txt` → `python -I scripts/vo_timing.py vo.wav phrases.txt` → paste
   PHRASES into the composition.
4. Build the episode from `demo/PopShort.tsx`: sets (saturated paint), cast (pop builds + `stick`), KEYS camera
   path, acts, tag, accent words.
5. Look check: render 1 fps samples at half scale (`--every-nth-frame=30 --scale=0.5`), contact sheet, then
   `measure_look.py` on the frames. Fix before the long render.
6. Sound: write `cues.json` (types: drill, tick, whoosh, boing, crickets, fuse, boom, thud, ding) on exact words →
   `python -I scripts/audio_mix.py vo.wav cues.json mix.wav` (leveled against the VO, music ducked, −14 LUFS).
7. Final: `python -I scripts/render_win.py <project> PopShort out/final.mp4 --audio audio/mix.wav` (motion blur,
   short-path browser, mux). Then `flicker.py` on the video: spikes only at whips / light switches / impacts.

## Windows notes
- Deep folders break Remotion (`spawn … chrome-headless-shell.exe ENOENT`, `ffmpeg.exe ENOENT`): use a short project
  path (`C:\videos\<name>`); `render_win.py` copies the browser to `%TEMP%\rchs` and renders a JPEG sequence, so
  Remotion's bundled ffmpeg is never spawned.
- ffmpeg `bandpass` width defaults to Q: always pass `width_type=h` for a width in Hz (a Q of 1400 is silence).
