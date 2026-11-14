# Lessons learned (symptom → cause → rule)

Generic lessons taken from the CURIOPEDIA production log (Nov 2026), on top of the rules in SKILL.md. Read before
building and before delivering. **When the director flags a new defect, add a row here in the same task**, with its
cause and rule. If a note repeats across several scenes, fix the rule, not just the scene.

## Geometry and models

| Symptom | Cause | Rule |
| --- | --- | --- |
| A custom mesh looks inside-out (outer skin missing, dome invisible, inside shows) | Triangle winding left faces pointing inward | After building any custom mesh, render one still before going on; if the inside shows, reverse the triangle order |
| A `LatheGeometry` piece renders solid black | Profile points given top to bottom → normals point inward and the inverted-hull ink shows | Give lathe points bottom to top; if a piece comes out black, check its normals first |
| A character's walk starts inside a prop and stops on top of another | Paths chosen without looking at the set | List the floor props (grill, brick, table, flowers) before fixing paths; keep ≥ 0.5 m clear |
| The support foot slides on the ground | Gait phase not tied to distance travelled | `phase = distance / stride × 2π` (stride ≈ 0.9 m for an adult build) |
| A raised hand hides behind a big head | Big head, short arm | When the arm goes high, raise the shoulder outward (up to ~110°) and bend the elbow upward |
| A runner's forearm bends backward | Sign flipped in the elbow flex | Check a motion strip of every new limb in all phases before the film; a runner's forearm always bends forward |
| A fall reads stiff, like a plank | The whole figure was rotated | A fall bends the torso and knees and puts the hands down; test it on a frame strip first |
| A hair bun detaches from the head when walking in 3/4 | Back hair follows the turn, not the head shape | Check every hairstyle walking in 3/4 before use |
| In profile the eye sits on the edge of the face | Features projected on a perfect sphere | Features turn ~70% of the body's angle toward profile |

## Camera and framing

| Symptom | Cause | Rule |
| --- | --- | --- |
| Macro shots where the subject fills the frame and doesn't read | In vertical the visible width is only ~0.56 × the height; only the height was computed | Frame from the visible width (height × 0.56) and leave air around the subject |
| The character exits the bottom of the frame | High camera looking up; the near ground falls out of frame | With a full character, camera at 1–1.5 m height, character ~4 m away; check feet and head on a still |
| Heads cut off or frame-filling, giant foreground flowers hiding the feet | Camera too close and too low in the foliage | Full body: distance and FOV giving ≥ 1.7 m visible height; low camera only in a clear lane |
| A vehicle shows its back and the occupant is hidden | Heading set by eye | Heading toward camera = `atan2(dx, dz)` from the object to the camera |
| A prey seen straight from below reads as a ball | No features in the silhouette from below | Show silhouettes obliquely, where the shape is recognizable |
| A character seems to float in front of a platform | Camera below the surface they stand on; feet drawn in front of its edge | Camera at or above the support surface, or hide the feet behind the edge |

## Light and color

| Symptom | Cause | Rule |
| --- | --- | --- |
| The hero's face almost fully in shadow | Sun on the side opposite to where they look | Place the key on the face's side every shot (azimuth toward where they look, behind camera) |
| A backlit prop turns gray (a banana) | Two-tone toon shading leaves it in the shadow tint | Props that must keep their color against the light get a small emissive self-color |
| Burnt colors (fluorescent green, pink skin) | Light intensity meant for tens of meters used at 10 units | Tune light intensity on a test still; a saturated two-tone material is a sign of too much light |
| First measured pilot: L\* 62, chroma 36, saturated 23%, edges 12%, −27 LUFS | Set paint too pale, too much light, mix not normalized | More saturated set paint, a little less light, two-pass loudnorm to −14 LUFS (pop-look.md targets) |

## Text and captions

| Symptom | Cause | Rule |
| --- | --- | --- |
| A caption or meter sits on the hero's face | Fixed text position; the subject crosses that zone during the shot | Check start, middle and end of every shot with text; if the subject crosses, move or fade the text |
| A tag lands on the caption band | Placed under an object without checking the band | No tag below y ≈ 1250 in 1080 × 1920; check every tagged shot on the sheet |
| Dark-blue titles unreadable on a dark set | Low contrast | White or gold text; check contrast at phone size |
| Compact display font letters touch at large sizes | Tight brand font | `letterSpacing: 0.04em` on large titles |
| Words stuck together in masked text ("NIBOATS") | The space inside an `inline-block` with `overflow: hidden` collapses | Separate words with margin, not spaces |

## Code, React and tooling

| Symptom | Cause | Rule |
| --- | --- | --- |
| Duplicate eyes or extra pupils in the video, but clean on a single still | Duplicate React `key`s between siblings: React keeps stale copies between frames | Unique, prefixed keys in every list (`eye0`, `brow0`); check moves on a 12-frame strip from the MP4, not only stills |
| SVG clips or filters show the previous frame's shape | Chrome doesn't always redraw a `clipPath`/filter that changes shape under the same `id` | Put the rounded shape in the id (`eye{uid}_{x}_{rx}`); sanitize `useId()` with `replace(/[^a-zA-Z0-9_-]/g, "")` |
| A visible seam where two skies or ground and horizon meet | Two layers with coinciding edges | Extend the ground past the frame or blend with a gradient |
| A Python checker fails on Windows with accented text | File read without an encoding | Always `open(..., encoding="utf-8")` |
| `tsc` breaks on copies of a kit inside the project | `tsc` scans every folder | Exclude skill copies, output folders and `node_modules` in `tsconfig.json` |
| Render fails with "Timeout… Fetching … font" | The project fetched a web font and the network blipped | Retry the frame or render; prefer local fonts in `public/fonts` |

## Delivery

| Symptom | Cause | Rule |
| --- | --- | --- |
| A Short shipped with voice only | No licensed music or SFX in the project | Prepare music and SFX before the final (`audio_mix.py` can synthesize SFX); never deliver without listening to the mix, or say clearly that it was not heard |
| A video shipped without a thumbnail | Not on the delivery list | Thumbnail per language with every video (shot-review.md §7) |
| A test was rendered with the old egg-head characters instead of the director's character sheets (flagged by the director) | The kit's default cast was used; the stickman premium sheets were only documented | Every character is built from its sheet with the stickman premium kit (stickman-characters.md §3) and checked with `Sheet<Name>` before any video render |
| A bell-shaped hairdo showed an empty hole between the hair and the cheeks | Hair shells were single-sided, so the inside was culled | Hair that flares away from the head (`bowl`, `swept`) renders double-sided |
| A carved 3D nose rendered as a black triangle | Per-facet normals made the post ink trace every facet edge | Small carved parts use welded, smooth normals; only the head keeps flat facets |
