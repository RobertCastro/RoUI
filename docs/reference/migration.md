# Guía de migración

RoUI dirige los estados desde la **semántica** (atributos ARIA), no desde clases
de demostración. Al adoptar los contratos accesibles (Fase 3) se retiraron varios
patrones basados en clases `.is-*` y `--active`. Esta guía resume los cambios
incompatibles y su reemplazo.

## Principio

El estado activo/abierto/seleccionado se dibuja desde el atributo, no desde una
clase. Reemplaza los selectores de clase por selectores de atributo y deja que el
controlador correspondiente gestione el estado.

## Tabs

| Antes | Ahora |
|---|---|
| `.ro-tab--active` | `.ro-tab[aria-selected="true"]` |
| Cambiar clase por JS propio | `createTabsController` (roving tabindex, flechas) |
| Panel oculto con clase | Panel con `role="tabpanel"` y atributo `hidden` |

## Navegación

| Antes | Ahora |
|---|---|
| `.ro-nav-link--active` | `.ro-nav-link[aria-current="page"]` |
| Breadcrumb con clase de estado | Último tramo con `aria-current="page"` |

## Accordion

| Antes | Ahora |
|---|---|
| `.is-open` en el ítem | `createDisclosureController` con `data-ro-disclosure-persistent` |
| Panel mostrado por clase | `role="region"` + atributo `hidden` |
| Sin estado en el encabezado | Botón con `aria-expanded` y `aria-controls` |

## Combobox

| Antes | Ahora |
|---|---|
| `.is-open` en la lista | `input[aria-expanded]` + `listbox` con `hidden` |
| `.is-active` en la opción | `[role="option"][aria-selected="true"]` |
| Foco movido a la opción | Foco en el input + `aria-activedescendant` |

## Command Palette

| Antes | Ahora |
|---|---|
| Overlay propio ad-hoc | `role="dialog"` modal vía `createOverlayController` |
| Lista con clases de estado | Combobox `inline` dentro del diálogo |
| Sin atajo estándar | `Ctrl/Cmd+K`, cierre con `Escape` |

## Calendar

| Antes | Ahora |
|---|---|
| `--selected` por clic | `role="grid"` + `[role="gridcell"][aria-selected="true"]` |
| Sin teclado | `createGridController` (flechas por día/semana, `Home`/`End`) |

## Toast

| Antes | Ahora |
|---|---|
| `setTimeout` fijo, sin roles | `createToastController` con `role="status"`/`role="alert"` |
| Sin pausa | Pausa el cierre al pasar el puntero o enfocar |

## Cómo actualizar

1. Sustituye los selectores de clase de estado por selectores de atributo ARIA en
   tu CSS/JS propio.
2. Inicializa el controlador de cada patrón (`@robertcastro/roui/primitives/*`).
3. Marca el estado inicial en el HTML con los atributos correctos (`aria-selected`,
   `aria-expanded`, `hidden`, `aria-current`).

## Codemod

Las conversiones deterministas de clase de estado a atributo se automatizan con el
codemod `legacy-states` (`ro-tab--active` → `aria-selected`, `ro-nav-link--active`
→ `aria-current`, …). Ver `codemods/README.md`. Los cambios de comportamiento
(paneles y listbox) se migran a mano.
