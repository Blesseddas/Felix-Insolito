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
