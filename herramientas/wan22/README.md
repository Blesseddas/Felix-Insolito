# Wan 2.2 en Google Colab (prueba)

Cuaderno: [wan22_felix_colab.ipynb](wan22_felix_colab.ipynb). Anima una imagen del canal con el modelo oficial
**Wan 2.2 TI2V-5B** (https://github.com/Wan-Video/Wan2.2) en vertical 704×1280, 24 fps, unos 5 s.

## Requisitos
- Cuenta de Google y **Colab de pago** (Pro o con unidades de cómputo): hace falta una GPU **L4 o A100**.
  El modelo pide al menos 24 GB de memoria de vídeo; la GPU gratuita T4 (16 GB) no alcanza y el cuaderno se para
  en la primera celda si la detecta.
- La imagen del plano (por ejemplo `imagenes/ep01/felix-ia-2.png`).

## Pasos
1. Abre https://colab.research.google.com → *Archivo → Subir cuaderno* → elige `wan22_felix_colab.ipynb`.
   (Si conectas Colab con GitHub, también puedes abrirlo desde el repositorio.)
2. *Entorno de ejecución → Cambiar tipo de entorno → GPU L4* (o A100) → Guardar.
3. Ejecuta las celdas en orden con ▶:
   1. Comprueba la GPU.
   2. Instala el código oficial (5–15 min).
   3. Descarga el modelo (unos minutos).
   4. Te pide subir la imagen.
   5. Genera el vídeo (varios minutos). Cambia `PROMPT` por el texto de Kling del plano.
   6. Descarga el resultado.
4. Sube el clip a `clips/ep01/` como `ep01-pNN-wan22.mp4` para compararlo con Kling v3.

## Avisos
- El cuaderno **no se ha ejecutado todavía**: es la receta oficial del README de Wan 2.2 adaptada a Colab. Si una
  celda falla, copia el mensaje de error y se corrige.
- `flash_attn` a veces no se instala en Colab; el README oficial recomienda instalarlo al final, que es lo que hace
  la celda 2. Si falla y la generación se rompe, habrá que probar otra versión.
- Colab cobra por tiempo de GPU encendida: al terminar, *Entorno de ejecución → Desconectar y eliminar entorno*.
