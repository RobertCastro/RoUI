# Menu, Popover y Tooltip accesibles

RoUI separa tres patrones que antes compartían un toggle visual. Cada uno tiene
semántica y teclado propios para no anunciar contenido ni comportamiento
equivocado a tecnologías de asistencia.

## Menu

Use Menu solo para una lista de acciones. El disparador es un `button` nativo
con `aria-haspopup="menu"`, `aria-controls` y `aria-expanded="false"`. El
panel inicia con `hidden`, usa `role="menu"` y cada acción usa `role="menuitem"`.

```html
<div class="ro-dropdown" data-ro-disclosure-root>
  <button data-ro-disclosure-trigger aria-haspopup="menu"
    aria-controls="account-menu" aria-expanded="false">Cuenta</button>
  <div class="ro-menu" id="account-menu" data-ro-disclosure-panel
    role="menu" aria-label="Cuenta" hidden>
    <a class="ro-menu__item" role="menuitem" href="/profile">Mi perfil</a>
    <button class="ro-menu__item" role="menuitem">Cerrar sesión</button>
  </div>
</div>
```

`ArrowDown` y `ArrowUp` desde el disparador abren y enfocan el primer o último
item. Dentro del panel, Arrow, `Home` y `End` recorren las acciones; `Escape`
cierra y devuelve el foco al disparador. `Tab` cierra sin interferir con el
orden natural de foco. No use este patrón para navegación persistente ni para
formularios complejos.

## Popover

Popover sirve para contenido contextual no modal. El disparador tiene
`aria-expanded` y `aria-controls`; use `aria-haspopup="dialog"` y
`role="dialog"` si el panel ofrece interacción, con un nombre accesible. Para
contenido estrictamente descriptivo, omita `role="dialog"` y mantenga el
contenido conciso. Cierra con `Escape` o una interacción fuera del patrón, sin
trap de foco ni bloqueo de scroll.

```js
import { createDisclosureController } from "@robertcastro/roui/primitives/disclosure-controller";

createDisclosureController(document.querySelector("[data-ro-disclosure-root]"));
```

El mismo controlador reconoce Menu por el `role` del panel y aplica solamente
la navegación adicional que ese patrón requiere.

## Tooltip

Tooltip comunica una descripción breve, nunca una acción ni contenido que el
usuario deba recorrer. El disparador mantiene el foco; el mensaje es un elemento
real con `role="tooltip"` asociado por `aria-describedby`.

```html
<span class="ro-tooltip-trigger">
  <button aria-label="Filtrar" aria-describedby="filter-tip">…</button>
  <span class="ro-tooltip" id="filter-tip" role="tooltip">Filtrar</span>
</span>
```

El estilo muestra el mensaje con hover o `:focus-within`, respeta reduced motion
y no requiere JavaScript. Si el contenido necesita enlaces, botones, foco propio
o permanecer abierto, use Popover o Dialog, no Tooltip.

## Límites y verificación manual

- No hay submenús ni posicionamiento por colisiones en este contrato.
- Compruebe con teclado: trigger → Arrow → items → Home/End → Escape; y que
  un clic fuera cierre sin desplazar el foco inesperadamente.
- Verifique que cada tooltip se anuncia como descripción del control y que no
  duplica su nombre accesible.
- Axe, matriz de navegadores y regresión visual se incorporan en Fase 4.
