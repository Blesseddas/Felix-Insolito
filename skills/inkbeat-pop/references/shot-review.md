# Shot plan and shot-by-shot review

Adapted from the CURIOPEDIA production skill (methods only). It complements `plan/plan_src.py` (timing anchored to
words) with *what* each shot must show and *how* it is signed off. Use it for every Short and long form.

## 1. Sentence to action
Build each shot around the visual question it answers. Keep a list of the objects and verbs in the narration.

- **Every named object gets a recognizable asset.** A plane needs fuselage, wings and tail; a boat needs hull, deck
  and a way on board. Generic boxes or spheres standing in for a narrated object are never final. Abstract shapes
  are allowed only for diagrams, and the plan says so.
- **Every physical verb becomes a whole action.** "We board the boat": approach from the dock, foot on the gangway,
  hand on the rail, weight transfer, arrival on deck, reaction. "With astronauts on board": show an interior,
  window or cutaway if their presence carries the explanation.
- **Acting:** anticipation → action → contact → recovery. In locomotion, pin each foot during its support phase
  and move the body's center over it. Grips stay locked to the prop during contact and release after. The eyes
  lead to the target; a reaction closes the gesture. Breathing and blinks are secondary motion only.
- **A narrator in front of a still character is not a shot.** Give the character an action, a discovery or a
  physical reaction, or cut to the object when the object is the subject.

## 2. The shot plan (`shots.json`, next to `plan.json`)
Register each asset once, then reference it from shots:

```json
{
  "fps": 30, "size": [1080, 1920],
  "assets": [
    {"id": "boat", "role": "object", "status": "pending",
     "recognition_cues": ["hull", "deck and rail", "cabin"]}
  ],
  "shots": [
    {"id": "board", "start_frame": 0, "end_frame": 90,
     "narration": "We board the boat.",
     "spoken_objects": ["boat"], "visible_assets": ["hero", "boat", "gangway", "dock"],
     "action": {"verb": "board", "subject": "hero",
                "phases": ["approach", "foot on gangway + hand on rail", "weight transfer", "arrive + react"],
                "contacts": "support foot pinned on each surface, hand on rail"},
     "camera": {"framing": "wide → medium", "movement": "lateral track, push in", "purpose": "follow the climb"},
     "lighting": {"source": "low sun camera-left", "contact_shadows": true, "effects": "water glints"},
     "depth": {"method": "3d", "foreground": "rope post", "action_plane": "gangway", "background": "harbor",
               "occlusion": "rail in front of legs"},
     "text": {"caption_zone": "70% height", "tags": ["PIER 4 on the sign"]},
     "sound": ["footsteps on wood", "gull"],
     "review": {}, "evidence": []}
  ]
}
```

- Planning times may be estimates marked provisional; snap them to the real voice-over (via `plan_src.py`) before
  the final render. Shots are contiguous: each `start_frame` equals the previous `end_frame`.
- An asset stays `pending` until its final file exists and has been looked at. A delivery with a `pending` asset
  that the narration names stays open.

## 3. Scenes with several characters
- Every person on screen has a narrative purpose and a visible action. Don't line up still figures with generic
  hands. The speaker looks at the listener; the listener reacts.
- Relationship of the hero to the scene, pick one per sentence: **observes** from a logical spot, **interacts**
  (approaches, points, holds a shared prop, steps aside to reveal), **moves with** the group, **absent** (the cast
  shows the mechanism alone), or **no humans** when they add nothing.
- **Blocking first:** floor coordinates of doors, corridors, tables, walk directions, the action axis, the camera
  and the focus target. For every give/take/touch/open, note the hand, the prop, the contact frame and who holds
  the prop before, during and after.
- **Three levels of detail** to save render cost:
  - *hero* (1–2): full rig, expressions, fine shadows, micro-acting;
  - *support* (1–3, mid distance): enough articulation and expression, light materials;
  - *background* (2–8): walk/chat cycles, simplified builds. Don't keep a costly crowd that adds no information.
- Everyone comes from the film's one character family (characters.md). If a character is missing, write their
  family overrides and render a turnaround (front, 3/4, profile, back) plus expressions before using them.
- Test 4–6 hard frames per scene first (entry, contact, focus change, end), then a 1–2 s clip, then the final.

## 4. Review criteria, per shot

| Criterion | Evidence to record |
| --- | --- |
| `objects` | Frame where the narrated object's features read clearly |
| `action` | Start, contact or support, and end of the physical action |
| `identity` | Face, two arms, two legs, joints coherent; hair and clothes right in every turn |
| `camera` | Framing and move reveal information; camera never inside geometry or past a set edge |
| `lighting` | Clear source direction, lit side and shadow side, silhouette separation |
| `depth` | Perspective, layers, occlusion; method (3d / 2.5d) recorded |
| `composition` | Objects distinguishable at crossings and camera changes |
| `text` | Faces, hands and the key object free of text for the whole shot; captions legible and on the word |
| `fluency` | Action plays right at full speed; supports and contacts stable, no foot slide |
| `audio` | Voice intelligible; mix checked in the final file |

Mark each `pass` / `fail` / `pending` with one concrete observation, e.g.
`"objects": {"status": "pass", "observed": "hull, deck and gangway read at frame 62"}`. Save three `evidence`
entries per shot with `phase` = `start`, `key`, `end`, an absolute `frame` and the path of a still taken **from
the final render**, all at different frames inside the shot. If something is absent by a valid staging decision,
say so in that criterion's observation. A planning approval documents decisions; a delivery approval requires
looking at the render.

## 5. Before the final render
On top of the 1 fps gate in pop-look.md:
1. Contact sheet of the whole video at **2 fps**.
2. Every shot checked at **start, middle and end, at phone size**, one item at a time:
   - characters rest on something real (nothing floating, nothing in front of what should hide it);
   - hair and clothes right in every turn;
   - no text or tag inside the caption band, and no text over faces;
   - the camera is never inside an object and never shows the set's edge;
   - hands and props are in contact;
   - the light has a lit side and a shadow side.
3. If anything fails, fix it and re-check that shot. **Never render a final with a known defect.**

## 6. After the render
- `ffprobe` for size, fps, duration and tracks; decode the whole file with `ffmpeg -v error -i out.mp4 -f null -`.
- Watch it once muted (does the story read?) and once with sound (timing, mix, sync). Say what could actually be
  heard in the review environment.
- Tie each defect to its shot and frame, fix the asset/acting/depth/camera/text that caused it, re-render the
  affected shots and re-check them inside the full cut.

## 7. Deliverables
- The MP4(s) in each requested language and format, the reproducible project and its render command.
- **A thumbnail with every video, one per language, unasked.** Compose it as a Remotion still in the same world
  (same light, same characters, same ink), the hero visible, a short text that differs from the title. Check it at
  full size and shrunk to phone size.
- A review summary with its evidence, and a list of known defects and pending checks.
