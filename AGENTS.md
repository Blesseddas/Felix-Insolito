# Reglas para cualquier IA que trabaje en este repositorio

Válido para ChatGPT, Gemini, Claude y cualquier otro agente. Si una regla choca con una petición, pregunta al director.

## Personajes
- Siempre con su hoja de referencia adjunta: `personajes/felix-referencia.jpeg` (Félix Insólito, presentador) y
  `personajes/jensen-huang-hoja.webp` (Jensen Huang). No inventar cabeza, peinado, bigote, ropa ni proporciones.
- Estilo Stickman 3D premium (`skills/stickman-3d-personajes-premium/`): cara angular y facetada, pelo
  volumétrico, cuello y piernas finísimos, zapatos pequeños bajos y oscuros, contorno negro.
- Cero logos y cero marcas en ropa, objetos y decorados (el nombre de una persona sí puede aparecer; el de su
  empresa no).

## Imágenes y vídeo
- Formato vertical **9:16** (1080 × 1920 al final). La cara del personaje entre el 25 % y el 60 % de la altura;
  el tercio inferior libre para subtítulos.
- Un plano = un fotograma de inicio (y opcionalmente uno de final) → un clip de Kling v3 de 3–5 s.
- Colores saturados en el decorado, luz cálida principal + contraluz, sombras de contacto.

## Herramientas fijas
- **Imágenes:** GPT Image (ChatGPT, o GPT Image en Artlist), siempre con la hoja del personaje adjunta. Gemini no se
  usa: no mantiene a Félix.
- **Animación:** Kling v3 Standard 720p en Artlist (Seedance 2.5 solo cuando el canal esté monetizado).
- **Voz:** ElevenLabs, una sola voz para todo el canal (configuración en `config/elevenlabs-tts.example.json`; la
  clave va en `.env`, que no se sube).

## Formato y movimiento (decisión del director, 17-nov-2026)
- **Solo Shorts de unos 70 s** hasta monetizar el canal; los vídeos largos vienen después.
- **Todo plano con personas va animado** (Kling v3). Una imagen fija con movimiento de cámara en Remotion solo se
  permite para **lugares u objetos** sin personas.

## Créditos de Artlist: no malgastar
1. **Nunca usar los ajustes por defecto.** Por defecto Artlist pone 10 s y audio: un clip de Seedance salía a 2.000–5.000
   créditos. Fijar siempre duración (3–5 s) y **audio apagado** (la voz va aparte con ElevenLabs).
2. **Pedir el precio antes de generar** y que el director apruebe cada tanda (por ejemplo, "13 imágenes ≈ 1.300").
3. **Primero todas las imágenes, después el vídeo.** Solo se anima una imagen aprobada; repetir una imagen cuesta
   100 créditos, repetir un clip 320–400.
4. **Imágenes en GPT Image Medium 1K** (100 créditos): sobra para animar a 720p. High 2K (160) solo para miniaturas.
5. **Una variante por imagen**, salvo planos difíciles; nada de lotes de 4.
6. **Duración justa:** el clip dura lo que dura su frase en la voz (redondeando hacia arriba), no más.
7. **Reutilizar:** el último fotograma de un clip sirve de imagen inicial del siguiente, y un buen clip de Félix
   hablando sirve para varias apariciones.
8. **Nada de render 1080p de borradores** de Seedance (1.000 créditos por segundo).
9. Apuntar en `guiones/<episodio>/creditos.md` cada generación: qué, modelo, créditos y si se usó.

## Hechos y personas reales
- Cada dato del guion con fuente fiable registrada en `guiones/<episodio>/hechos-verificados.md`.
- Escándalos, acusaciones e investigaciones se narran como **reportes o alegaciones** con su fuente
  ("según The New York Times…") y se ilustran con objetos, titulares genéricos o la reacción de Félix.
  **Nunca** recrear a una persona real cometiendo algo no probado.
- Temas evergreen o noticias con fecha clara; no inventar cifras.

## Archivos
- Nombres: `<episodio>-p<NN>-<descripcion>.<ext>`.
- No subir: `node_modules/`, `out/`, claves, contraseñas ni datos personales.
- Cada error que señale el director se apunta en `skills/inkbeat-pop/references/lessons-learned.md`.
