# SKILL — Creador de Personajes Stickman 3D Premium

Este kit independiente produce hojas de referencia al estilo de Félix, con **zapatos pequeños y bajos como los de Félix**, rostros facetados y **prohibición absoluta de marcas**. **Reglas innegociables v1.1: fondo verde chroma key #00FF00 detrás de cada personaje y formato horizontal 16:9 siempre** (3840×2160 recomendado; 1920×1080 mínimo).

## Uso con Claude Code / Kimi Code
1. Descomprime este ZIP.
2. Copia la carpeta `stickman-3d-personajes-premium` al directorio de SKILLS que utilice tu agente; no reemplaces otras skills existentes.
3. Abre el proyecto o sesión y pide: «Lee `SKILL.md` de la skill stickman-3d-personajes-premium. Crea la hoja completa de [PERSONA] usando la foto que adjunto y respetando los zapatos de Félix. Sin logos ni marcas. Fondo verde #00FF00 y salida horizontal 16:9».
4. Adjunta foto de la persona si quieres fidelidad específica. La imagen `assets/felix-referencia.jpeg` se usa como **referencia de estilo y pies**, nunca para clonar a Félix.

## Estructura
- `SKILL.md`: instrucciones principales
- `references/identidad-y-estilo.md`: ADN de la colección
- `references/control-calidad.md`: checklist
- `prompts/prompt-maestro.md`: prompt reusable
- `templates/personaje.json`: ficha estructurada
- `assets/felix-referencia.jpeg`: referencia original proporcionada por el usuario

## Limitaciones
Un PNG de hoja es referencia visual, no un personaje 3D riggeado. Para animar se requiere modelado y rig o una implementación equivalente.
