# Empezar con RoUI

RoUI es un design system en CSS con primitivas accesibles sin dependencias. Puedes
adoptarlo con un bundler (npm) o sin build (CDN).

## Instalación (npm)

```bash
npm install @robertcastro/roui
```

Importa el bundle una vez en tu entrada:

```js
import "@robertcastro/roui"; // bundle completo (dist/roui.css)
```

O de forma granular:

```js
import "@robertcastro/roui/tokens.css";
import "@robertcastro/roui/reset.css";
import "@robertcastro/roui/components/button.css";
```

## Sin build (CDN)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@robertcastro/roui/dist/roui.min.css" />
```

## Usar un componente

Los componentes son HTML + clases `ro-`:

```html
<button class="ro-btn ro-btn--primary" type="button">Guardar</button>
```

## Temas

Activa un tema con `data-ro-theme` en un contenedor (o en `html`):

```html
<html data-ro-theme="dark">
  …
</html>
```

Temas disponibles: `light`, `dark`, `high-contrast`. Remapean los tokens
semánticos (`--ro-bg`, `--ro-text`, `--ro-surface`, …).

## Densidad

Activa un modo de densidad con `data-ro-density` en cualquier contenedor:

```html
<div data-ro-density="compact">…</div>
```

Valores: `compact`, `comfortable`. Sin el atributo, el tamaño no cambia (es el
valor por defecto). Ajusta el padding de Button, Input y celdas de Table vía
`--ro-btn-py/px`, `--ro-input-py/px` y `--ro-table-cell-py/px` — los demás
componentes todavía no responden a la densidad. Las variantes de tamaño
explícitas (`ro-btn--sm`, `ro-btn--lg`) fijan su propio padding y no cambian
con la densidad.

## RTL

RoUI se probó con `dir="rtl"` en la galería de componentes y en la plantilla
de módulo (Chromium, Firefox y WebKit): no genera scroll horizontal. Esa
prueba verifica que el layout no se rompe, **no** que cada componente se
refleje visualmente — la mayoría del CSS usa propiedades físicas
(`padding-left`, `text-align: left`, …) en vez de propiedades lógicas
(`padding-inline`, …), que sí son las únicas 3 hojas de estilo
(`shell.css`, `header.css`, `toolbar.css`) que se voltean solas con `dir`.
El resto se beneficia parcialmente del comportamiento nativo de flex/grid con
`gap` (que sí invierte el eje principal), pero iconos direccionales
(`chevron-left/right`, `arrow-left/right`) no cambian de sentido automáticamente.
Si adoptas RTL, probá los componentes concretos que uses y esperá tener que
sobreescribir manualmente la dirección de esos iconos por ahora.

## Accesibilidad

Cada componente documenta su propio contrato de teclado y ARIA en su página de
referencia (sección "Accesibilidad"), agrupados también por patrón en
`accessibility/*.html`: overlays (`dialog-drawer`, `menu-popover-tooltip`),
navegación (`tabs-accordion-navigation`), controles nativos
(`native-controls`), contenido y estado (`content-and-status`, `toast`) y
combobox/calendar/command-palette. Todos verificados con axe (0 violaciones)
y, para los patrones con comportamiento, con pruebas de teclado en navegador
(foco, trap, `Escape`, roving tabindex).

## Primitivas accesibles

Los patrones con comportamiento (Dialog, Combobox, Tabs, …) usan primitivas ESM
sin dependencias. Ejemplo de un diálogo modal:

```js
import { createOverlayController } from "@robertcastro/roui/primitives/overlay-controller";

const overlay = createOverlayController(document.getElementById("mi-dialogo"));
document.getElementById("abrir").addEventListener("click", () => overlay.open());
```

El marcado declara los roles y estados; el controlador gestiona foco, `Escape` y
restauración. Ver el contrato de cada patrón en la referencia.

## Con frameworks

- **React / Vue / Svelte**: importa el CSS una vez en la raíz y usa las clases
  `ro-` en tu marcado. Para las primitivas, instáncialas en un efecto de montaje
  (`useEffect`, `onMounted`) sobre la ref del elemento y destrúyelas al desmontar.
- El sistema es framework-agnóstico: no aporta componentes de un framework, sino
  CSS y controladores que envuelves a tu gusto.
- Ejemplos ejecutables sin build en el repositorio: `examples/react/` y
  `examples/vue/` (además del `examples/starter/` en vanilla).
- Piloto local de adopción: `examples/pilot-dashboard/` combina componentes,
  temas y primitivas en un dashboard operativo sin build.

## Siguiente

- Referencia por componente: `index.html`.
- Contratos de accesibilidad y guía de migración enlazados desde cada componente.
- Ejemplo mínimo sin build: `examples/starter/` en el repositorio.
- Piloto de adopción: `examples/pilot-dashboard/`.
