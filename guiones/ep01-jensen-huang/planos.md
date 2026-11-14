# ep01 — Lista de planos y prompts (Gemini → Kling v3)

## Cómo usar este archivo
1. **Gemini (imagen):** en cada petición adjunta las hojas indicadas en "Personajes" (`personajes/felix-referencia.jpeg`,
   `personajes/jensen-huang-hoja.webp`). Pega primero el **bloque de estilo común** y después el prompt del plano.
   Pide formato vertical 9:16.
2. Guarda la imagen como `imagenes/ep01/ep01-pNN-inicio.png` (y `-final.png` si el plano tiene fotograma final).
3. **Kling v3 Standard 720p (Artlist):** imagen de inicio (+ final si existe) y el prompt de movimiento. Duración
   indicada. Resultado: `clips/ep01/ep01-pNN.mp4`.
4. El acercamiento de cámara, los subtítulos, la voz y la música se añaden en el montaje (Remotion); no hace
   falta pedírselos a Kling.

**Presupuesto estimado en Artlist:** 14 planos, unos 60 s × 80 créditos/s ≈ **4.800 créditos** (las imágenes de
Gemini no gastan créditos de Artlist).

## Bloque de estilo común (pegar antes de cada prompt)

> Vertical 9:16 image for a YouTube Short. Premium stylized 3D cartoon render in the "stickman premium" style of
> the attached character sheets: big expressive head with an angular, faceted face, volumetric sculpted hair,
> very thin neck, arms and legs, small low dark shoes, clean black outlines, saturated colors, warm key light with
> a soft rim light and contact shadows. Keep every character EXACTLY as on its sheet (face, hair, mustache,
> glasses, outfit, proportions). No logos, no brand names, no readable text unless the prompt asks for it. Leave
> the lower third of the frame calm for subtitles; faces in the upper half.

## Planos

### P01 — Noticia de última hora (4 s) · Personajes: Félix
- **Imagen:** ya existe → `imagenes/ep01/felix-ia-2.png` (renombrar a `ep01-p01-inicio.png`).
- **Kling:** The anchor delivers breaking news to camera, mouth moving under his handlebar mustache, one eyebrow
  raised, a small nod, fingers tap the desk. Keep everything else identical.
- (Ya hay una prueba de Kling v3 de este plano en `clips/ep01/felix-kling3-720p.mp4`.)

### P02 — "Se llama Jensen Huang" (4 s) · Personajes: Félix, Jensen (en pantalla)
- **Gemini:** Félix at his red news desk turns his head toward the big studio screen on the right. On the screen,
  a cartoon portrait of Jensen Huang exactly as on his sheet (silver swept-back hair, rectangular glasses, plain
  black leather jacket), smiling confidently. Félix points at the screen with one hand, sarcastic half-smile.
- **Kling:** Félix turns from the camera to the screen and points at it; the portrait on the screen glows softly.

### P03 — Lavaplatos y baños (5 s) · Personajes: Jensen joven
- **Gemini:** A teenage version of the Jensen Huang character (same face design, younger, black hair, no glasses
  change, thin stickman body) washing a huge stack of plates at a steel sink in the back kitchen of a generic
  1970s American diner (no signs, no brand). Rubber gloves, a white apron, a mop bucket and a toilet brush in a
  corner. Warm kitchen light, steam.
- **Kling:** He scrubs a plate fast, puts it on the tall stack, the stack wobbles; he steadies it and wipes his
  forehead.

### P04 — Fundación en el reservado (5 s) · Personajes: Jensen (adulto joven) + dos amigos genéricos
- **Gemini:** A red vinyl booth in the same generic diner. The young adult Jensen character (black hair, glasses)
  sits with two original cartoon friends in the same stickman style (one bearded, one with curly hair; invented,
  not real people). On the table: coffee cups, a napkin with a hand-drawn sketch of a computer chip, a pen.
  Excited planning mood, evening light through the window.
- **Kling:** Jensen taps the napkin sketch, the friends lean in, all three nod and clink coffee cups.

### P05 — La apuesta rara de 2006 (5 s) · Personajes: Jensen
- **Gemini:** Jensen (as on his sheet, black hair version) in a small lab holds a glowing green-and-black graphics
  card (generic, no logo) next to a microscope, a model of a DNA helix and a weather map on a monitor. Two
  original scientists look skeptical with crossed arms. A small calendar on the wall shows "2006".
- **Kling:** Jensen proudly lifts the card; the scientists exchange doubtful looks and shrug.
- **Final (opcional):** same scene, coins flying out of a piggy bank on the desk ("parece dinero tirado").

### P06 — 2012: dos tarjetas de videojuegos (5 s) · Personajes: dos investigadores genéricos
- **Gemini:** A messy student bedroom at night: a desktop PC with its side open showing exactly two big gaming
  graphics cards glowing (no logos). Two original young researchers in the stickman style stare at the monitor,
  which shows a grid of small images (cats, cars, mushrooms) with green check marks. A trophy shaped like a
  picture frame appears on the desk.
- **Kling:** The check marks fill the grid one by one; the researchers jump up and high-five; the trophy shines.

### P07 — Fiebre del oro: vende las palas (5 s) · Personajes: Jensen
- **Gemini:** A cartoon gold-rush canyon. Crowds of tiny generic miners dig frantically. In the foreground Jensen
  (silver hair, glasses, black leather jacket as on his sheet) stands behind a wooden stall selling shiny golden
  shovels whose blades are shaped like computer chips. A long queue waits at his stall.
- **Kling:** Miners rush to the stall; Jensen hands out shovels one after another with a calm smile.

### P08 — Cinco billones (4 s) · Personajes: Jensen
- **Gemini:** Jensen on a stage stands next to a giant glowing number "$5.000.000.000.000" made of stacked golden
  chips, confetti in the air, a huge upward arrow behind him. Plain black leather jacket, no logos.
- **Kling:** The number lights up digit by digit, confetti falls, Jensen opens his arms.

### P09 — Chaqueta de cuero y tatuaje (4 s) · Personajes: Jensen, Félix (reacción)
- **Gemini:** Close-up of Jensen in his black leather jacket pulling the collar aside to show a small tattoo on
  his shoulder: a simple stylized eye-and-chip doodle (generic, not a real logo). Félix appears in a small
  picture-in-picture circle in the corner, eyebrows raised, impressed.
- **Kling:** Jensen proudly shows the tattoo and winks; Félix in the corner raises both eyebrows.

### P10 — "Todo rey tiene su punto débil" (3 s) · Personajes: Félix
- **Gemini:** Félix at his news desk, the studio lights dimmed to a dramatic blue, a single spotlight on him. He
  leans toward the camera, serious, one finger raised. Behind him the big screen shows a golden crown with a crack.
- **Kling:** The crown on the screen cracks further; Félix slowly narrows his eyes and leans in.

### P11 — Según The New York Times (5 s) · Personajes: Félix
- **Gemini:** Félix sits at his desk reading a big generic newspaper (no real masthead) whose front page shows a
  silhouette of a woman in a trench coat and a headline-like block with only the words "ESPIONAJE" and "REPORTE".
  A red question mark floats above. Moody blue light.
- **Kling:** Félix lowers the newspaper slowly, raising one eyebrow; the question mark pulses.

### P12 — Otra relación, perdón e investigación (5 s) · Personajes: Félix
- **Gemini:** Félix's desk seen from above: a folder stamped "CONFIDENCIAL", a magnifying glass, an envelope with
  a broken heart drawing and a small paper note that says "PERDÓN". Félix's thin hands are spreading the papers.
- **Kling:** The hands slide the papers apart, the magnifying glass passes over the folder, the note flutters.

### P13 — Renuncia tras 33 años (4 s) · Personajes: Jensen (simbólico)
- **Gemini:** An empty big office at dusk: a CEO chair turned toward a window, a black leather jacket hanging on
  the chair, a golden crown placed on the desk next to a calendar showing "12 NOV". Long shadows, quiet mood.
- **Kling:** The chair slowly rotates and stops empty; the light outside fades; the crown glints once.

### P14 — Cierre de Félix (5 s) · Personajes: Félix
- **Gemini:** Félix back in the bright colorful studio, close-up, warm light. He holds a small glowing graphics
  chip in his palm and looks at it fondly with a half-smile; on the screen behind him, a tiny version of himself
  made of light, as if the chip were bringing him to life.
- **Kling:** Félix looks at the chip, then up to the camera with a knowing half-smile; the chip pulses with light.

## Seguimiento

| Plano | Imagen Gemini | Clip Kling | Notas |
|---|---|---|---|
| P01 | Hecha (GPT Image) | Prueba hecha | |
| P02–P14 | Pendiente | Pendiente | |
