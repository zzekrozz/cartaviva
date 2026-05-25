# CartaViva

Landing + MVP inicial del builder para crear cartas digitales visuales con fotos, menú del día, productos agotados y QR.

## Rutas incluidas

- `/` Landing comercial
- `/builder` Builder/panel editable con guardado en localStorage
- `/demo` Carta pública de ejemplo
- `/carta/casa-amelia` Vista pública simulada usando los datos guardados en este navegador

## Notas

- Este MVP no tiene login, base de datos ni pagos todavía.
- El builder guarda los cambios en `localStorage`.
- El QR es visual/placeholder. El QR descargable real queda para la siguiente fase.
- Preparado para desplegar en Vercel con Next.js, React, TypeScript y Tailwind CSS 3.4.17.
