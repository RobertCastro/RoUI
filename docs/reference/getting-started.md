# Empezar con RoUI

RoUI es un design system en CSS con primitivas accesibles sin dependencias. Puedes
adoptarlo con un bundler (npm) o sin build (CDN).

## Instalación (npm)

```bash
npm install @robertcastro/roui
```

Importa el bundle una vez en tu entrada:

```js
import "@robertcastro/roui";           // bundle completo (dist/roui.css)
```

O de forma granular:

```js
import "@robertcastro/roui/tokens.css";
import "@robertcastro/roui/reset.css";
import "@robertcastro/roui/components/button.css";
```

## Sin build (CDN)

```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@robertcastro/roui/dist/roui.min.css">
```

## Usar un componente

Los componentes son HTML + clases `ro-`:

```html
<button class="ro-btn ro-btn--primary" type="button">Guardar</button>
```

## Temas

Activa un tema con `data-ro-theme` en un contenedor (o en `html`):

```html
<html data-ro-theme="dark"> … </html>
```

Temas disponibles: `light`, `dark`, `high-contrast`. Remapean los tokens
semánticos (`--ro-bg`, `--ro-text`, `--ro-surface`, …).

## Primitivas accesibles

Los patrones con comportamiento (Dialog, Combobox, Tabs, …) usan primitivas ESM
sin dependencias. Ejemplo de un diálogo modal:

```js
import { createOverlayController }
  from "@robertcastro/roui/primitives/overlay-controller";

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
