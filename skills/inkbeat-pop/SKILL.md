---
name: inkbeat-pop
description: v2 of inkbeat-shorts tuned for the Shorts feed - toon-shaded 3D cartoon Shorts in Remotion + React Three Fiber with the "pop" look (saturated set paint, big-headed expressive characters with black stick-man arms and legs, Panchang captions with one yellow accent word), a fixed Spanish narrator voice, synthesized SFX + music mixed to -14 LUFS, look metrics, and a Windows-safe render with motion blur. Use it to make, fix or measure a narrated 3D cartoon Short (story / curiosity / "misunderstood genius" formats), or when a Remotion 3D render flickers or fails to launch on Windows.
---

# inkbeat-pop (v2): feed-first 3D cartoon Shorts

**Start here for v2** — everything below section "inkbeat-shorts" still applies; v2 changes what reads on a phone:
- Read [references/pop-look.md](references/pop-look.md) first: measured targets, the 10 pop rules, the production
  loop, Windows notes. The reference episode is `templates/src/demo/PopShort.tsx` (composition `PopShort`, 10.9 s,
  voice + SFX timing, acts pop → night → golden, stick limbs, Panchang captions).
- New project: copy `templates/` to a **short path** (`C:\videos\<name>`), `npm install`, then
  `python -I <skill>/scripts/get_panchang.py <project>` (the font is downloaded per user; its license forbids
  bundling). Captions fall back to Poppins if Panchang is missing.
- Voice: `templates/audio/voice.json` (one narrator for the whole series; vidIQ voiceover connector or
  elevenlabs-tts with the same voice id; ×1.12 atempo).
- New scripts: `vo_timing.py` (phrase spans from pauses), `audio_mix.py` (SFX + music from a cues.json, leveled,
  −14 LUFS), `measure_look.py` (color/edge targets), `render_win.py` (short-path browser, JPEG sequence, tmix motion
  blur, audio mux), `get_panchang.py`.
- Character API additions: `<Character3D stick />` (black stick arms/legs, ball hands, oval feet), pop builds
  (`headScale` 1.45 / kid 1.6). Captions: `font` (default `Panchang`), `size`, `accentColor="#ffd21a"`.
- Gate before every long render: 1 fps half-scale samples → contact sheet → `measure_look.py` → fix → final.
- **Characters always follow the Stickman 3D premium style**: read
  [references/stickman-characters.md](references/stickman-characters.md) before designing or building any
  character. Build them from `src/inkbeat/char/stickmanCast.ts` (`FELIX`, `JENSEN`): carved `headShape`, `nose3d`,
  `bowl`/`swept` hair, `handlebar` mustache, `rect` glasses, `suit`/`leather` outfits, thin legs. Never use the old
  egg-head `CAST` characters or `stick` in new videos. Check each one with `Sheet<Name>` before animating. Angular faceted head, black stick limbs, Félix's small low dark shoes, volumetric hair, zero logos.
  Character sheets are 16:9 on chroma green `#00FF00` (prompt in `prompts/hoja-personaje-prompt-maestro.md`,
  reference `assets/characters/felix-referencia.jpeg`).
- **Story, shot review and lessons** (adapted from a production skill, methods only):
  - [references/script-and-retention.md](references/script-and-retention.md): read **before generating any voice**.
    Promise, six story structures, a planted clue, reveal with visible proof, a 10-point script review, facts.
  - [references/shot-review.md](references/shot-review.md): every narrated object gets a recognizable asset and
    every physical verb a full action; a `shots.json` per video; scenes with several characters (blocking, three
    levels of detail); 10 review criteria per shot with start/key/end evidence frames; a 2 fps pre-render check;
    a thumbnail per language with every video.
  - [references/lessons-learned.md](references/lessons-learned.md): symptom → cause → rule table. Read it before
    building and before delivering, and add a row for every defect the director flags.

# inkbeat-shorts: toon-shaded 3D Shorts and long-form videos in Remotion

A field guide distilled from building 3D cartoon Shorts and long-form films in Remotion + three.js / React Three Fiber
(R3F). Every rule below came from a render that was rejected. Deeper notes live in `references/`:

- [camera-and-editing.md](references/camera-and-editing.md): the beat rig, transitions, long-form vs Short grammar,
  vertical reframing
- [look-and-ink.md](references/look-and-ink.md): grade, lights, the post-process ink outline, materials, numbers that
  worked
- [flicker-and-determinism.md](references/flicker-and-determinism.md): every flicker cause found, its fix, how to hunt
  the next one
- [render-and-qa.md](references/render-and-qa.md): render recipe, motion blur, the GPU lock, QA tools and thresholds
- [shorts.md](references/shorts.md): Shorts from scratch and Shorts cut from a long form, captions, sound-off
  readability
- [audio-and-voice.md](references/audio-and-voice.md): voice-over workflow, music, SFX levels, loudness
- [production.md](references/production.md): plan-first workflow, gates, contracts, working with sub-agents and
  budgets, privacy
- [characters.md](references/characters.md): one character family, form shading, 3/4 heads, character ink, acting
- [sets-and-materials.md](references/sets-and-materials.md): painted textures, per-material recipes, set dressing,
  real scale, sky, sea and weather

`scripts/` (Python 3 + numpy + ffmpeg, paths as arguments): `flicker.py` (one-frame spikes + broken-tab stride test),
`analyze_pacing.py` (beats/min, % still, % fast, hard cuts, mean L*), `gpu_lock.py` (one render on the GPU at a time).

## 0. Start every new project from `templates/` (v2: see the top of this file and references/pop-look.md)
`templates/` is a Remotion 4 starter with the whole look already wired. For a new project:
1. Copy the contents of `templates/` into the new project folder and run `npm install` (the one install this skill
   asks for; on the first render Remotion itself also downloads its Chrome Headless Shell, ~130 MB).
2. Render the demo still first: `npx remotion still src/index.ts Demo out/demo.jpg --scale=0.5 --gl=angle
   --timeout=240000`. Look at the `DemoHero`, `DemoWide` and `Demo-<mood>` compositions before building a set, so you
   know the baseline.
3. Build on it; don't rebuild what is there:
   - the post chain (ink, grade, bloom, DOF), toon and painted materials, moods (day, dusk, night, cold, lamp,
     golden), per-character cast lights and the shadow PCF patch;
   - the beat camera rig (`aim`, `poseAt`, shot presets in `core/shots.ts`);
   - IK (`solveArm`, `handWorld`, `holdInFront`) for props held in the hand;
   - all-white captions; a thick-liquid material (`core/liquid.tsx`);
   - motion blur (`DemoMoveSub` + ffmpeg `tmix`, render-and-qa.md); the word-anchored planner `plan/plan_src.py`;
   - a finished character system, `src/inkbeat/char/Character3D.tsx`, with one default family (`char/family.ts`: every
     proportion, palette and face-style number) and three example characters (`char/cast.ts`: an adult, a kid, an
     elder). Design your own cast by changing the overrides; keep every character of a film in one family
     (characters.md). `DemoCast` shows the three in one light.

For a target look, give Claude 5-10 frames from videos you like, for private analysis only: measure light, color and
pacing, but don't copy their characters, designs, sets or other distinctive elements. Keep the frames outside the
project and its git repo, and never ship or publish them.

## 1. Two grammars: pick the right one
**Shorts (vertical), the viral 3D cartoon cadence** (measured on a sample of popular 3D cartoon Shorts):
- **There are no cuts, there are camera beats.** About **56 beats/min** (range 45–66), a new framing every ~0.86 s,
  hard cuts ≈ 0 per video. The move *is* the transition: dolly, orbit, crane, whip, push-through, dissolve for time
  jumps.
- **The camera is never still:** ~5% still frames, ~34% fast-motion frames. Between moves the camera keeps drifting at
  about a third of peak speed. Moves last ~19 frames with a symmetric ease-in-out and start ~6 frames before their
  word.
- Pushes in outnumber pulls out about 2:1. Small rolls inside orbits. Shake only on a comic impact.
- The key object is on screen in the first 2 s. The pace is fastest in the first 40% and ~25% calmer for the payoff;
  the explanation gets the longest, calmest holds.
- **Sentence starts land on a beat** (~68%). Moves follow clauses, not every word.

**Long form (16:9), a calm film:** the Shorts cadence on a long film reads as cheap and tiring.
- **Hold each framing ~3–6 s** (inserts such as a clock, phone or calendar ≥ 2 s), cut with classic coverage (master →
  medium → close, reverses, keep the 180° line). No orbits, swings, whips, hand-held drift, decorative moves, or
  inserts that cut away and straight back.
- **A few zooms:** a slow eased push across a whole hold on about 1 framing in 3, 0.06–0.14 of the lens-to-subject
  distance.
- **No burned-in captions** in long form (ship an SRT). Held frames are perfectly still (drift 0): see section 5.

## 2. Plan first, never type a time
- Get word timings for the final voice-over (TTS alignment or forced alignment). Write a small `plan_src.py` that
  anchors every setup and beat to `(turn, "phrase", occurrence)` and generates `plan.json` + the TS module your
  composition imports (the starter `plan/plan_src.py` does this for shots, captions and tags; add beats and a readable
  `PLAN.md` as you grow it). To move a beat, edit the source and re-run.
- Print the stats every run: beats/min, longest holds and where, hard cuts, sentence starts on a beat, an estimate of
  fast-motion share. **Targets for Shorts: 56 ± 4 beats/min, ≤ 35% fast frames, ≈ 0 hard cuts.** Planning ~10% more
  beats than the target helps: small moves on flat frames don't register on the analyzer.
- Light follows the acts: give every act its own light and palette (dusk, night, a cold interior, or a golden payoff).
- Put sound-off tags in the plan (section 7). Work in gates: plan → STOP → look-dev stills → STOP → pilot/Short →
  STOP.

## 3. Look: crisp, not milky
Haze, wide bloom, heavy depth of field, grain and lifted blacks read as cheap. Target:
- a clear key light with definite shadows; heads with a lit and a shadow side (never flat white);
- a saturated clean palette per act; bloom only on practical light cores; mild DOF; **no grain**;
- bright day frames, **mean L\* ≈ 50–54**; slightly lifted, tinted blacks are fine for a Short, true black ink on top;
- **premium pass**: stronger key and rim, less ambient, a fresnel rim term in the toon material, soft halation on
  highlights; outdoors, aerial haze and sun rays **in the distance only** (haze on the subject washed the opening
  out). Eye-check the first second after every light change.
- Unlit colors > 1.0 burn to cream in the grade: keep emissive cores ≤ 1.0–1.2 and saturated.
- **Ink outlines in post**, not inverted hulls on everything: depth + normal + object-id edges; ink ≥ 2.5% of the
  frame, colored per mood, never neutral black. Characters get heavier ink than the set. Settings in look-and-ink.md.
- Warm against cool in every frame, no monochrome washes, no stacked shade tints; shadows colored, never gray; night
  is luminous ultramarine, not murky (numbers in look-and-ink.md).
- Painted textures (texture energy ≥ 0.45, but flat surfaces quiet so they don't read as dirt), ≥ 12 props in every
  framing, real scale, toy-like props (sets-and-materials.md).
- Characters: one written-down character family, lit and shadow side, 3/4 heads, always acting, never a real person's
  likeness (characters.md).

## 4. Physical plausibility (check every framing)
- Hands and arms vs blankets, tables, laptops, books, mugs; doors vs heads; bodies vs beds, walls, chairs; walks go
  through open doorways. If a pose can't avoid it, change the pose, blocking, prop size or framing.
- Props at real scale (a book ≈ 0.6 × head width), held IN the hand with two-bone IK to a world target, never
  floating.
- A floating UI panel is anchored to something (a desk, a wall, a prop); never alone in the air.
- Named actions are shown and readable: if the voice says someone lifts, opens or climbs something, show the whole
  action.
- The camera is never inside geometry (check the whole move, not only the keys), never above a missing ceiling, never
  beyond a set edge (an interior must never show sky). Nothing sits where a character's head overhangs its shoulders.
- Moves between distant framings must stay framed the whole way (no empty sky mid-move): pan from one position or
  route the move past something.

## 5. Flicker: the causes found, and the rule behind each fix
1. **Per-tab state.** Remotion renders with several browser tabs; any three.js state initialized once per tab differs
   between tabs. **Every frame must be a pure function of the frame number**: no `Math.random`, `Date`,
   `performance.now`, no one-time-initialized objects whose state changes later, no caches keyed by `Object3D.id`,
   nothing mutated only on some frames. Example: a shadow camera whose projection was computed once → recompute and
   call `updateProjectionMatrix()` every render.
2. **GPU overload.** Three renders in parallel × concurrency 8 lost GL state: every 8th frame went dark. **One render
   on the GPU at a time** (a lock, see render-and-qa.md); concurrency ≤ 8 for finals, ≤ 3 for tests.
3. **Camera drift** makes screen-space ink and bloom crawl on fine detail → long-form held frames are perfectly still;
   Shorts move but use motion blur.
4. **Dotted ink**: double-sided wavy planes (curtains) → one flat normal per double-sided mesh in the normal pass;
   object boundaries → object-id edges; sub-pixel sticks → skip ink below a projected thickness; grazing planes → turn
   off the one-sided depth-jump test; animated grain or ink wobble → 0.
5. **Z-fighting**: coplanar overlapping boxes (wall corners from two boxes sharing a face, ground slabs whose tops
   meet) → offset ≥ 1 cm, start the second wall behind the first; decals ≥ 3–4 mm proud; live mirrors off when unused.
   Bars and frames must only touch, never overlap (overlaps inked a flickering black blob).
6. **Shadow crawl**: snap the shadow box to whole shadow texels and quantize its size; patch three's screen-locked PCF
   dither (it crawls under any camera move).
7. **Memory**: a per-object material cache grew every shot → the browser ran out of memory. Bound every cache.
8. **Strobing**: fast periodic motion (anything cycling at ~4 Hz) and very fast lens moves read as flicker even with
   motion blur: cycles ≤ ~2 Hz, big moves ≥ ~0.85 s.
Hunt the next one with `scripts/flicker.py`, then crop the region over 3 frames (flicker-and-determinism.md).

## 6. Render and QA (summary; recipe in render-and-qa.md)
- WebGL in headless Chrome: `--gl=angle`, a long `--timeout` (240 s), one render process, one bundle per project
  (bundles copy `public/`: clean up old ones you created, watch the disk).
- **Motion blur on every Short:** render 4 sub-frames per frame across a 180° shutter at 4× fps, average with ffmpeg
  `tmix`, keep every 4th frame. Captions are keyed to the output frame, so they stay sharp.
- QA on every render: `flicker.py` (spikes from whips or lightning are fine; trace the rest), `analyze_pacing.py`
  (beats/min, % still, % fast, cuts, L\*), a 2 fps contact sheet eye-checked for interpenetration and empty frames,
  loudness, and a **muted** read of the sheet: does the story read without sound?

## 7. Shorts specifics (more in shorts.md)
- **Captions:** 1–2 lowercase words, swapped exactly on word onsets (2 frames early), no pop or scale, centered at
  **70% height**, a heavy geometric sans, **≥ 90 px at 1080 wide**, a heavy dark outline, every word white (an accent
  color is optional). Spoken punctuation kept.
- **Sound-off readability:** viewers scroll muted. Put the story in the picture with 1–3 word tags painted on the key
  objects (a year, a price, a label), bold, large, high contrast, **unlit** so the light can't wash them out.
- **Vertical framing:** subject in the upper part (faces at 30–45% height) so captions at 70% never cover faces.
- **Zoom levels:** the push inside a hold ~3%/s, on a set change ~12% (7% or 30% read as too busy).
- The picture ends ~0.7 s after the last word.

## 8. Audio (more in audio-and-voice.md)
- Music bed ~14 dB under the speech (long-form edits ~20+ dB), a −3 dB duck under the voice, faded at the end.
- Story SFX on the exact word, 6–8 per 20 s, **each leveled against the voice** (peak ~8 dB under the voice peak, the
  loudest 100 ms ≥ 6 dB under the speech RMS); one global SFX gain lets transients and sustained tones jump out.
- Two-pass loudnorm to −14 LUFS, −1 dBTP. Never overlap-crossfade cut VO segments (it shortens audio, captions drift).
- Check licenses of every music track you ship; a library track can still draw a content claim.

## 9. Production habits that saved the most time
- A contract file + plan JSON per sequence + one owner per area (core, sets, cast, sequences, UI, audio).
- A pilot (~80 s or the first 15 s of a Short) under the new rules, shown before rolling out.
- Shared sets change only additively: a new variant flag that defaults to the old behavior.
- A typecheck gate before every bundle (one syntax error in an auto-loaded module breaks everyone's bundle).
- Sub-agents burn budget fast (many in parallel can use up a usage window in well under an hour): default to none, at
  most 2–3; at most 3 images per step.
- If asked to work autonomously, don't stop for gates. Confirm a defect still exists before fixing it.
- Nothing from the maker's computer or identity in anything published (paths, user names, emails, dates); no real
  brands or logos (production.md).
