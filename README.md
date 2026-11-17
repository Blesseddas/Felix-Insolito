# Félix Insólito

Canal de Shorts animados en 3D cartoon. El presentador es **Félix Insólito** (hoja en `personajes/felix-referencia.jpeg`).
Este repositorio es el punto de encuentro de todas las herramientas: cada una lee y deja su trabajo aquí.

## Cómo trabajamos (quién hace qué)

| Paso | Herramienta | Qué deja en el repo |
|---|---|---|
| 1. Investigación y guion | ChatGPT o Claude | `guiones/<episodio>/guion.md` con fuentes verificadas |
| 2. Lista de planos y prompts de imagen | Claude | `guiones/<episodio>/planos.md` (un prompt de imagen por plano) |
| 3. Fotogramas | **GPT Image** (ChatGPT o GPT Image en Artlist; es la IA que creó a Félix). Gemini NO: no mantiene al personaje | `imagenes/<episodio>/<plano>-inicio.png` (y `-final.png` si el plano lo necesita) |
| 4. Animación | Artlist → Kling v3 Standard 720p (Seedance 2.5 cuando el canal esté monetizado) | `clips/<episodio>/<plano>.mp4` |
| 5. Voz | **ElevenLabs** (una sola voz para todo el canal) | `audio/<episodio>/voz.mp3` |
| 6. Subtítulos, música y montaje | Claude Code + Remotion | `src/` (composición) y el vídeo final fuera del repo (`out/`) |
| 7. Revisión | El director | Comentarios en issues o en `guiones/<episodio>/notas.md` |

Antes de trabajar, toda herramienta lee [AGENTS.md](AGENTS.md) (reglas comunes) y las skills de `skills/`.

## Carpetas

```
personajes/          hojas oficiales de los personajes (referencia obligatoria en cada imagen)
guiones/<episodio>/  hechos verificados, guion, lista de planos, prompts, notas
imagenes/<episodio>/ fotogramas generados (GPT Image)
clips/<episodio>/    clips animados (Kling v3, Seedance)
skills/              reglas de estilo y producción (inkbeat-pop, stickman-3d-personajes-premium)
src/                 proyecto Remotion: montaje, subtítulos, cámara, personajes 3D en código
audio/ plan/ public/ recursos del proyecto Remotion
docs/                documentación técnica de la plantilla
out/                 renders locales (no se suben)
```

## Nombres de archivo

`<episodio>-p<NN>-<descripcion>.<ext>`, por ejemplo `ep01-p03-chip-coronado-inicio.png`.
Un plano = una fila de `planos.md` con el mismo número.

## Episodios

| Episodio | Tema | Estado |
|---|---|---|
| ep01 | Jensen Huang: del lavaplatos al rey de la IA (y su caída) | Hechos verificados; prueba de Félix con GPT Image + Seedance 2.5 / Kling v3 en `clips/ep01/` |

## Proyecto Remotion

```bash
npm install
npx remotion studio src/index.ts
```

Render en Windows con desenfoque de movimiento: ver `skills/inkbeat-pop/references/render-and-qa.md`.
