# Dialog y Drawer accesibles

Dialog y Drawer son overlays modales: detienen la interacción con el contenido
de fondo mientras están abiertos. RoUI entrega el estilo CSS y un controlador
ESM opcional para el comportamiento común; el consumidor conserva el control
del marcado, los textos y el momento de apertura.

## Contrato de marcado

- El disparador es un `button` nativo con `aria-haspopup="dialog"`,
  `aria-controls` y `aria-expanded="false"`.
- El contenedor del overlay inicia con `hidden` y cubre la página.
- El panel tiene `role="dialog"`, `aria-modal="true"`, un nombre mediante
  `aria-labelledby` (o `aria-label`) y `tabindex="-1"` como fallback de foco.
- Las acciones de cierre son botones nativos con `data-ro-overlay-close` y un
  nombre accesible. El backdrop lleva `data-ro-overlay-backdrop` cuando no es
  el propio contenedor.
- Drawer utiliza el mismo contrato. Elija `aside` cuando el panel sea una
  región complementaria; el rol modal sigue siendo `dialog`.

```html
<button
  id="edit-trigger"
  aria-haspopup="dialog"
  aria-controls="edit-dialog"
  aria-expanded="false">
  Editar perfil
</button>

<div class="ro-overlay" id="edit-dialog" hidden>
  <section class="ro-modal" role="dialog" aria-modal="true"
    aria-labelledby="edit-title" tabindex="-1">
    <header class="ro-modal__header">
      <h2 class="ro-modal__title" id="edit-title">Editar perfil</h2>
      <button type="button" data-ro-overlay-close aria-label="Cerrar">×</button>
    </header>
    <div class="ro-modal__body">…</div>
  </section>
</div>
```

## Controlador

```js
import { createOverlayController } from "@robertcastro/roui/primitives/overlay-controller";

const trigger = document.querySelector("#edit-trigger");
const overlay = createOverlayController(document.querySelector("#edit-dialog"));

trigger.addEventListener("click", () => overlay.open(trigger));
```

Al abrir, el controlador enfoca el primer control del panel; si no existe,
enfoca el panel. Mantiene el foco dentro con `Tab` y `Shift+Tab`, bloquea el
scroll del documento y actualiza `aria-expanded`. `Escape`, un control con
`data-ro-overlay-close` o el backdrop cierran el overlay y devuelven el foco
al disparador. Use `initialFocus` para seleccionar un control específico.

```js
const overlay = createOverlayController(root, {
  initialFocus: "[data-autofocus]",
  closeOnBackdrop: false,
});
```

## Límites y verificación manual

- No abra un segundo overlay modal desde uno activo; el apilamiento se definirá
  como contrato explícito antes de soportarlo.
- No use un Drawer modal para navegación persistente de escritorio. En ese caso
  utilice un `aside` no modal sin este controlador.
- Pruebe el flujo con teclado: disparador → foco inicial → Tab/Shift+Tab →
  Escape → retorno al disparador. Repítalo con zoom al 200 %, reduced motion y
  contenido largo.
- La matriz de navegadores, axe y regresión visual se añade en Fase 4; estos
  casos no se declaran estables hasta disponer de esa evidencia.
