# Inventario y madurez de componentes

Baseline: 2026-07-10. Existen 49 archivos CSS de componentes. La clasificacion
evalua contrato, comportamiento accesible, pruebas y documentacion; no solamente
la apariencia.

## Niveles

- `experimental`: apariencia o API sin garantias completas.
- `beta`: contrato definido y pruebas parciales; puede cambiar.
- `stable`: contrato documentado, accesible y cubierto por quality gates.
- `deprecated`: tiene reemplazo y fecha de retiro.

## Estado actual

Todos los componentes se consideran `experimental`. Ninguno tiene hoy el
conjunto exigido de pruebas de comportamiento, axe, navegadores y regresion
visual para subir a `stable`.

| Grupo | Componentes/archivos | Riesgo principal |
|---|---|---|
| Fundamentos visuales | typography, icon, divider, code, prose | Contrato y pruebas visuales |
| Acciones | button, button-group, toolbar | Estados, teclado y touch targets |
| Formularios | form, input-group, number-input, slider, rating, file-upload, tags-input | Semantica, errores y teclado |
| Seleccion/navegacion | nav, segmented, pagination, breadcrumb, sidebar, tree, list-group | Roles, flechas, foco y RTL |
| Overlays | modal, drawer, popover, tooltip, menu, command-palette | Focus trap, portal, colisiones y Escape |
| Datos/estado | table, badge, tag, progress, progress-ring, spinner, skeleton | Anuncios, tablas responsive y reduced motion |
| Feedback | alert, toast, banner, empty | Live regions, cierre y contraste |
| Contenido/estructura | card, avatar, header, footer, description-list, timeline | Semantica y composicion |
| Disclosure | accordion, stepper | Estado ARIA y teclado |
| Fecha/entrada compleja | calendar, combobox | Patrones APG y localizacion |

## Orden de promocion

1. Fundamentos, Button y controles nativos.
2. Dialog/Modal y disclosure.
3. Popover, Tooltip y Menu.
4. Tabs/navegacion y feedback dinamico.
5. Combobox, Tree, Calendar y Command Palette.

## Criterio de promocion

Un componente solo cambia de nivel mediante una tarea que demuestre contrato,
documentacion, teclado, axe, navegadores y visuales requeridos por la Definition
of Done.

