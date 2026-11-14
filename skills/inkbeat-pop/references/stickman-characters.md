# Personajes Stickman 3D premium (estilo obligatorio de los personajes)

Integrado desde la skill `stickman-3d-personajes-premium` (v1.1). **Todos los personajes de inkbeat-pop siguen este
ADN**, en las hojas de personaje y en los vídeos. Referencia matriz: `assets/characters/felix-referencia.jpeg`
(Félix Insólito, figura del canal). Ejemplo de persona real: `assets/characters/jensen-huang-hoja.webp`.

## 1. ADN visual fijo (hoja y vídeo)
- **Cabeza grande y angular**: rostro facetado con planos en frente, pómulos, nariz, mandíbula y mentón; nunca
  cara redonda infantil ni piel fotorrealista. Contorno negro decidido, ojos expresivos con párpados.
- **Cuerpo stickman**: cuello estrecho, tronco contenido y vestido, brazos y piernas negros y finísimos, manos
  pequeñas legibles.
- **Pies de Félix**: zapatos pequeños, bajos, sencillos y oscuros, con la escala de la hoja de Félix. Nunca tenis
  grandes, botas, suelas gruesas ni pies anchos.
- **Pelo volumétrico** en mechones 3D, coherente de frente, perfil y espalda; nunca peluca plana ni pegote.
- **Cero marcas**: ningún logo, nombre de empresa, isotipo, monograma ni emblema en ropa, calzado, props, sets ni
  paneles. El nombre de la PERSONA puede aparecer; el de su empresa no. Revisar también la espalda de la ropa.
- **Luz**: key cálida, fill neutro, rim sutil, sombras de contacto.
- **Consistencia**: misma cara, peinado, ropa y altura en todas las vistas, expresiones y planos. Las expresiones
  cambian cejas, párpados y boca, no la cara.
- Del Félix se toma solo el estilo y los pies: no copiar su melena, bigote o traje a otros personajes.

## 2. Hoja de personaje (imagen de referencia, antes de animar)
Reglas innegociables de la hoja:
- **Lienzo horizontal 16:9 exacto** (3840×2160 recomendado, 1920×1080 mínimo). Nada vertical, cuadrado ni 3:2.
- **Fondo verde chroma key sólido `#00FF00`** detrás de cada figura (vistas, expresiones, poses, detalles, vista
  técnica). Sin degradados, paisajes ni transparencia. Rótulos y marcos pueden contrastar sin tapar el verde.

Composición:
- A) retrato hero grande a la izquierda;
- B) 5 vistas de cuerpo entero a la misma altura y sobre la misma línea de suelo: frontal, 3/4 frontal, perfil
  derecho, trasera, 3/4 trasera;
- C) 8 expresiones: neutral, feliz, serio, sorprendido, pensativo, confiado, molesto, sarcástico;
- D) 3–4 detalles: ojo, pelo, vello facial o boca, tela;
- E) paleta de 8 colores sin marcas;
- F) vista técnica orientativa (wireframe), sin fingir que es un rig;
- G) 5 poses: explicar, señalar, pensar, caminar, sostener un objeto genérico.

Etiquetas en español. Prompt reproducible: `prompts/hoja-personaje-prompt-maestro.md`. Ficha estructurada:
`templates/plan/personaje.json`.

**Generación de la imagen.** Cuando haya una herramienta de imagen conectada (por ejemplo un modelo GPT Image a
través de un conector), usar el prompt maestro y adjuntar la foto del sujeto + `felix-referencia.jpeg`. Generar
imágenes gasta créditos: confirmar con el usuario antes. Un PNG es referencia visual, no un personaje 3D animable.

**Control de calidad de la hoja (bloqueantes).** Rechazar y corregir si falla cualquiera: W/H = 16/9; verde
`#00FF00` detrás de todas las figuras (solo variaciones de compresión JPG); cero branding; pies estilo Félix;
cara angular; misma identidad en todo; cada figura completa de cabeza a pies. Después revisar pelo en 360°,
manos, ocho expresiones distintas, cinco vistas y cinco poses, sombras y ortografía.

## 3. En el vídeo: el kit de personajes stickman premium (`Character3D`)
**No usar los personajes antiguos** (`CAST.adult/kid/elder`, cabeza de huevo, modo `stick`) en vídeos nuevos.
Todos los personajes salen de `src/inkbeat/char/stickmanCast.ts` (`FELIX`, `JENSEN`) o se crean igual que ellos:

| Pieza de la hoja | Cómo se construye |
|---|---|
| Cabeza facetada y alargada | `look.headShape`: `facets` 12–16 (planos tallados), `width` < 1 cara estrecha, `top`/`bot` (suma ≈ 2,26), `jaw`, `chinExp` alto = mandíbula cuadrada, `chinFwd`. **Cada personaje con su propio `seed`.** |
| Nariz 3D en cuña | `look.nose3d: { w, out }` + `face.noseY` (altura) |
| Boca más abajo en caras largas | `face.mouthY` |
| Melena casco con flequillo y vuelo en campana | `hair: "bowl"` |
| Pelo con volumen peinado hacia atrás | `hair: "swept"` |
| Bigote en espiral 3D | `mustache: "<color>"` + `mustacheStyle: "handlebar"` |
| Gafas rectangulares | `glasses: "<color>"` + `glassesShape: "rect"` |
| Traje de cuadros con corbata a rayas | `outfit: "suit"` (`colors.accent` = color de la corbata) |
| Chaqueta de cuero lisa con cremallera | `outfit: "leather"` (sin logos) |
| Piernas finísimas, mangas finas, cuello largo y fino | `build.legWidth` ≈ 0,42–0,5, `armWidth` ≈ 0,72–0,86, `neck` + `neckWidth` |
| Zapatos pequeños, bajos y oscuros | zapatos del kit con `build.shoeScale` ≈ 0,9 y `colors.shoes` oscuro |

- Cabeza grande: `build.headScale` 1,5. Sin `stick` (las mangas y pantalones finos ya dan la silueta stickman).
- **Comparar cada personaje con su hoja antes de animar**: composiciones `Sheet<Nombre>` (5 vistas) y
  `Sheet<Nombre>Heads` (expresiones) de `demo/Turnaround.tsx`. Revisar frente, 3/4, perfil y espalda.
- Personaje nuevo: copiar `FELIX` o `JENSEN`, cambiar seed, forma de cabeza, pelo, ropa y paleta según su hoja;
  añadirlo a `STICKMAN_CAST` y renderizar sus hojas.
- En el vídeo el fondo NO es verde: los personajes viven en los sets saturados del look pop. El verde es solo para
  las hojas (y para recortes de composición, si se piden).
- Encuadre: estos personajes son más altos y cabezones; dejar la cara entre el 25 % y el 60 % de la altura del cuadro
  para que los subtítulos (70 %) queden bajo la barbilla.

## 4. Personas reales
- Recrear solo rasgos visibles (pelo, gafas, vello, ropa genérica). Ropa lisa, sin logos de su empresa.
- No mostrar a una persona real haciendo algo que no está documentado. Escándalos, acusaciones e investigaciones se
  narran como **reportes o alegaciones** («según The New York Times…»), con fuente y fecha, y se ilustran con
  objetos, titulares genéricos o símbolos, no recreando el supuesto hecho.
