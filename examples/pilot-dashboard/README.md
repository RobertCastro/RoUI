# Piloto Dashboard de RoUI

Producto consumidor local para validar adopcion multi-proyecto con
`@robertcastro/roui@1.1.0` desde CDN, sin build.

## Que valida

- Carga del bundle CSS publicado (`dist/roui.min.css`) desde jsDelivr.
- Uso conjunto de componentes: navegacion, metricas, cards, tabs, tabla, alert,
  formulario, modal y toast.
- Primitivas ESM publicas: `overlay-controller`, `tabs-controller` y
  `toast-controller`.
- Cambio de tema con `data-ro-theme`: `light`, `dark` y `high-contrast`.
- Flujo de adopcion: abrir modal de intake, guardar piloto y recibir
  notificacion accesible.

## Probar

Sirve el directorio por HTTP. Los modulos ESM del CDN no cargan por `file://`.

```bash
python3 -m http.server 8800 --bind 127.0.0.1
```

Abre:

```text
http://127.0.0.1:8800/examples/pilot-dashboard/
```

## Criterios de aceptacion del piloto local

- El CSS de RoUI se carga desde el paquete publicado.
- El modal atrapa foco, cierra con `Escape` y restaura foco al disparador.
- Tabs responden a flechas, `Home` y `End`.
- El toast se anuncia con region viva y puede cerrarse automaticamente.
- El cambio de tema no requiere bifurcar componentes.

## Limite

Este piloto local demuestra que la adopcion tecnica esta lista. El cierre formal
de Fase 7 aun requiere un producto real en produccion, mediciones y feedback de
consumidores.
