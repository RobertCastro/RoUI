# Tabs, Accordion y navegación accesibles

Estos tres patrones comparten estilos con listas y botones, pero exponen
semántica distinta. El marcado conserva roles, nombres y relaciones; los
controladores solo gestionan foco, estado y teclado.

## Tabs

Use Tabs para alternar vistas equivalentes dentro del mismo contexto. El
contenedor es `role="tablist"` con un nombre accesible; cada disparador es un
`button role="tab"` con `aria-selected` y `aria-controls`; cada vista es un
`role="tabpanel"` con `aria-labelledby` y `tabindex="0"` cuando su contenido no
es enfocable por sí mismo.

```html
<div class="ro-tabs" role="tablist" aria-label="Detalle del módulo" data-ro-tabs>
  <button class="ro-tab" role="tab" id="t-temario"
    aria-selected="true" aria-controls="p-temario">Temario</button>
  <button class="ro-tab" role="tab" id="t-discusion"
    aria-selected="false" aria-controls="p-discusion" tabindex="-1">Discusión</button>
</div>
<div id="p-temario" role="tabpanel" aria-labelledby="t-temario" tabindex="0">…</div>
<div id="p-discusion" role="tabpanel" aria-labelledby="t-discusion" tabindex="0" hidden>…</div>
```

```js
import { createTabsController } from "@robertcastro/roui/primitives/tabs-controller";

document.querySelectorAll("[data-ro-tabs]").forEach(createTabsController);
```

Solo la pestaña activa es tabbable (**roving tabindex**): la seleccionada tiene
`tabindex="0"` y el resto `-1`. Desde la lista, `ArrowRight`/`ArrowLeft`
(o `ArrowDown`/`ArrowUp` si `aria-orientation="vertical"`) mueven el foco,
`Home`/`End` van a la primera y última, y la **activación automática** muestra
el panel al enfocar. Con `data-ro-tabs-manual`, la activación ocurre con `Enter`
o `Espacio`. `Tab` sale de la lista hacia el panel activo.

## Accordion

Cada sección es un `disclosure` independiente (se permite más de una abierta).
El encabezado es un `button` con `aria-expanded` y `aria-controls`, envuelto en
un elemento de encabezado real; el cuerpo es `role="region"` etiquetado por el
botón e inicia con `hidden`.

```html
<div class="ro-accordion">
  <div class="ro-accordion__item" data-ro-disclosure-root>
    <h3 class="ro-accordion__heading">
      <button class="ro-accordion__head" data-ro-disclosure-trigger
        aria-expanded="false" aria-controls="acc-1">
        ¿Qué incluye el curso?
        <svg class="ro-icon ro-icon--sm ro-accordion__chevron" aria-hidden="true">
          <use href="#ro-i-chevron-down"></use></svg>
      </button>
    </h3>
    <div class="ro-accordion__panel" id="acc-1" role="region"
      aria-label="¿Qué incluye el curso?" data-ro-disclosure-panel hidden>…</div>
  </div>
</div>
```

Reutiliza el `disclosure-controller` con `data-ro-disclosure-persistent`:
`Enter`/`Espacio` sobre el botón nativo alternan la sección. A diferencia de
Menu y Popover, un accordion **no** se cierra al hacer clic fuera ni con
`Escape`; permanece hasta que el usuario togglea su encabezado. No se usa
`role="menu"` ni navegación por flechas entre encabezados en este contrato.

## Navegación

La navegación persistente **no** es un menú. Use un landmark `nav` con nombre y
marque la página actual con `aria-current="page"`; el breadcrumb usa el mismo
atributo en su último tramo.

```html
<nav class="ro-row" aria-label="Principal">
  <a class="ro-nav-link" aria-current="page">Inicio</a>
  <a class="ro-nav-link" href="/proyectos">Mis Proyectos</a>
</nav>
```

El estado activo se dibuja desde `[aria-current]`/`[aria-selected]`, no desde una
clase de demostración. Reserve `role="menu"` para listas de acciones (ver
`menu-popover-tooltip.md`).

## Límites y verificación manual

- Sin tabs diferidos, submenús ni posicionamiento por colisiones.
- Compruebe con teclado: `Tab` entra a la lista, Flecha/`Home`/`End` recorren,
  el panel activo recibe foco y el resto queda `hidden`; en Accordion `Enter`
  abre y `Escape` cierra devolviendo el foco al encabezado.
- Axe, matriz de navegadores y regresión visual se incorporan en Fase 4.
