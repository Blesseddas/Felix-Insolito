---
name: felix-insolito-produccion
description: Lista de control obligatoria para producir vídeos del canal Félix Insólito (Shorts de unos 70 s con Félix y personajes stickman 3D premium). Úsala SIEMPRE antes de escribir guiones, generar imágenes, animar con Kling, generar voz, montar o subir algo del canal, y antes de gastar un solo crédito de Artlist. Se revisa punto por punto; si un punto no se cumple, se para y se avisa al director.
---

# Félix Insólito — Lista de control de producción

Repositorio: `C:\Users\Yoidi Del Rosario\Documents\PROYECTOS IA\FELIX INSOLITO` (GitHub `Blesseddas/Felix-Insolito`).
Antes de nada leer `AGENTS.md`, `personajes/elenco.md` y `docs/estilo-mundo.md` del repositorio.

**Regla de oro:** ningún paso que gaste créditos se hace sin pasar su lista. Si una casilla no se cumple, PARAR y
decírselo al director antes de seguir. Errores que se repiten van a `skills/inkbeat-pop/references/lessons-learned.md`.

---

## 0. Antes de empezar cualquier tarea
- [ ] Cargar esta skill y la skill `stickman-3d-personajes-premium` si hay personajes.
- [ ] Leer `AGENTS.md`, `personajes/elenco.md` y el `planos.md` del episodio.
- [ ] Comprobar el saldo de Artlist y el registro `guiones/<episodio>/creditos.md`.
- [ ] Confirmar que se trabaja en la carpeta del proyecto (no en otra copia) y con `main` actualizado.

## 1. Formato y guion
- [ ] Short vertical **9:16**, unos **70 s**. Vídeos largos solo después de monetizar.
- [ ] Historia **evergreen**: sin «última hora», «acaba de», «hoy»; fechas absolutas.
- [ ] Cada dato con fuente en `hechos-verificados.md`. Escándalos y acusaciones solo como **reportes con fuente**
      («según The New York Times…»), nunca recreando a la persona real haciéndolo.
- [ ] Guion aprobado por el director antes de hacer imágenes.
- [ ] Félix es el narrador del plató; **se entra y se sale de la historia por la pantalla del plató**.

## 2. Personajes (TODOS, también los figurantes de un solo plano)
- [ ] Estilo `stickman-3d-personajes-premium`: **cara cuadrada y angular con planos tallados como Félix**, cabeza
      grande, cuello, brazos y piernas **finísimos**, **zapatos pequeños, bajos y oscuros como los de Félix**.
- [ ] **Nunca caras redondas tipo Pixar**, ni realistas, ni fotográficas.
- [ ] Contar ANTES cuántas personas salen en el episodio, plano por plano, e informar al director de **todas**
      (protagonistas y figurantes).
- [ ] Cada personaje que se repite, o que el director pida, tiene **hoja** (16:9, fondo verde `#00FF00`, 5 vistas,
      8 expresiones, 5 poses) guardada en `personajes/` y registrada en `elenco.md` y `elenco.json`.
- [ ] Personas reales: caricatura de rasgos visibles; sin logos de su empresa; detalles reales correctos
      (ej.: tatuaje de Jensen en el **hombro**, no en el pecho).
- [ ] Un figurante no puede parecerse a un protagonista (ej.: un investigador no puede parecer Jensen joven).

## 3. Imágenes (GPT Image; Gemini NO)
- [ ] Herramienta: GPT Image (ChatGPT del director, gratis para Artlist; o GPT Image 2.6 en Artlist, Medium 1K = 100).
- [ ] En **cada** prompt con personas se adjuntan: la hoja de **Félix como referencia de estilo** + la hoja de cada
      personaje que sale + (si es en el plató) la imagen del P01 para la continuidad del decorado.
- [ ] Bloque de estilo de `docs/estilo-mundo.md`: mundo 3D cartoon premium pulido, saturado, luz cálida con contraluz.
- [ ] Caras en la mitad superior; el tercio inferior libre para subtítulos. Sin logos, sin textos salvo los pedidos.
- [ ] **Imagen de prueba primero:** de cada personaje o figurante nuevo se genera UNA imagen y se espera el visto bueno
      del director antes de generar el resto.
- [ ] **Revisión de cada imagen antes de animar** (todas deben pasar):
  - [ ] cara angular como Félix (no redonda) en todas las personas;
  - [ ] cuerpo stickman finísimo y zapatos pequeños oscuros;
  - [ ] identidad igual a su hoja (pelo, gafas, ropa, edad);
  - [ ] detalles de hechos correctos;
  - [ ] continuidad de decorado con el plano anterior;
  - [ ] manos bien formadas, sin textos deformados, sin logos;
  - [ ] tercio inferior libre.
- [ ] Si una imagen falla, se corrige editando solo ese detalle (edición mínima), no se regenera todo.

## 4. Animación (Kling v3 Standard 720p en Artlist)
- [ ] Solo se anima una imagen **aprobada**.
- [ ] Todo plano con personas va animado; imagen fija con movimiento en Remotion **solo** para objetos o lugares.
- [ ] Ajustes: **3–5 s**, **audio APAGADO**, 720p. Nunca los valores por defecto (10 s + audio).
- [ ] Prompt de movimiento termina con: mantener personajes, ropa y decorado; sin textos nuevos; sin logos.
- [ ] **Revisión de cada clip**: inicio, mitad, final y hoja de contacto a 2 fps: caras estables (no cambian ni se
      deforman), manos, contacto con objetos, nada flotando, sin parpadeos raros. Si falla, se dice al director.

## 5. Créditos (no malgastar)
- [ ] Pedir precio exacto a Artlist y **aprobación del director** antes de cada tanda.
- [ ] Una variante por imagen; Medium 1K; nada de renders 1080p de borradores de Seedance.
- [ ] Reutilizar: último fotograma de un clip = inicio del siguiente; clips buenos de Félix se reutilizan.
- [ ] Apuntar cada gasto en `creditos.md`, incluidos los errores y su causa.
- [ ] Si el error es de Claude, decirlo claramente y proponer la forma más barata de corregirlo (por ejemplo,
      rehacer imágenes en el ChatGPT del director).

## 6. Voz, montaje y entrega
- [ ] Voz: **ElevenLabs**, una sola voz para todo el canal (pendiente de elegir); clave en `.env`, nunca en el chat.
- [ ] Montaje en Remotion: transiciones por la pantalla del plató, subtítulos palabra a palabra en el tercio inferior,
      música y efectos, volumen −14 LUFS.
- [ ] **Piloto primero** (primeros planos completos con voz) y aprobación del director antes de producir el resto.
- [ ] Revisión final fotograma a fotograma a tamaño de móvil, con y sin sonido. Ningún render final con un fallo
      conocido.
- [ ] Miniatura y textos de publicación.

## 7. Repositorio
- [ ] Imágenes en `imagenes/<ep>/`, clips en `clips/<ep>/`, nombres `<ep>-pNN-<...>`.
- [ ] Cada hoja nueva en `personajes/` + `elenco.md` + `elenco.json`.
- [ ] Commit y push al terminar cada paso; nada de `node_modules/`, `out/`, `.env` ni datos personales.

## 8. Al cerrar cada tarea
- [ ] Decir qué se hizo, qué falta, cuánto se gastó y qué no se ha podido comprobar.
- [ ] Si el director señaló un error, añadirlo a `lessons-learned.md` y, si es una regla nueva, a esta skill.
