# Starter de RoUI (sin build)

Página mínima que consume `@robertcastro/roui` desde el CDN de jsDelivr, sin paso
de compilación. Demuestra:

- Cargar el bundle CSS (`dist/roui.min.css`) y usar clases `ro-`.
- Activar un tema con `data-ro-theme`.
- Usar una primitiva accesible (`overlay-controller`) importada como módulo ESM
  desde el CDN.

## Probar

Sírvela por HTTP (los módulos ESM no cargan por `file://`):

```bash
npx serve examples/starter        # o: python3 -m http.server
```

Abre `http://localhost:3000` (o el puerto que indique) y pulsa «Abrir diálogo».

## Adoptar en tu proyecto

Fija la versión en las URLs del CDN para reproducibilidad, o instala por npm
(`npm install @robertcastro/roui`) y usa un bundler. Ver la guía de arranque en la
referencia (`getting-started`).
