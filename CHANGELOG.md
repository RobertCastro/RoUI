# Changelog

## 1.2.0

### Minor Changes

- d090de9: Migra los 39 literales de color restantes fuera de tokens: 21 tokens de alfa nuevos (`--ro-ink-{14,25,28,30,45}`, `--ro-on-dark-{06,10,18,20,30}`, `--ro-primary-{13,40}`, `--ro-secondary-40`, `--ro-{info,success,warning,error}-{08,30}`).
- d090de9: Variantes de ancho de Container (`--narrow`/`--wide`/`--fluid`), nuevo layout de un solo rail (`.ro-layout-rail`) para apps con un sidebar, ritmo vertical entre secciones (`.ro-section`/`--sm`), patrón de encabezado de página (`.ro-page-header`/`__actions`) y utilidades de aspect-ratio (`.ro-aspect-video`, `.ro-aspect-square`, `.ro-aspect`).
- d090de9: Escala de elevación ampliada a 4 niveles (`--ro-shadow-lg`/`--ro-shadow-xl`, aplicados a Modal, Command Palette y Drawer) y modo de densidad opt-in (`[data-ro-density="compact"|"comfortable"]`) que ajusta el padding de Button, Input y celdas de Table vía `--ro-btn-py/px`, `--ro-input-py/px` y `--ro-table-cell-py/px`. Sin el atributo, el tamaño no cambia.
- d090de9: Table: cabecera ordenable (`.ro-table__sort` + contrato `aria-sort`), selección de filas (`.ro-table__select`), header sticky con scroll vertical acotado (`.ro-table--sticky` + `.ro-table-wrap--scroll`) y estado vacío integrado (`.ro-table__empty-cell`).

### Patch Changes

- d090de9: Corrige tres bugs reales del paquete publicado: `.ro-nav-item:hover` tenía más especificidad que `.ro-nav-item--active`, dejando texto ilegible al pasar el cursor sobre el ítem activo; `--ro-control-focus-border` no coincidía en tono con `--ro-focus-ring` (y no cambiaba correctamente por tema, por un orden de import invertido entre `themes.css` y `components.css`); `reset.css` no estaba envuelto en `@layer`, por lo que su `outline` de `:focus-visible` rompía el `outline: none` de cualquier componente con anillo de foco propio (Button, Input, Avatar, Menu, Toast, Slider, …) en cuanto se importaba junto al bundle — el uso documentado en la guía de instalación.

## 1.1.0

### Minor Changes

- ecdf672: Primitivas accesibles nuevas como entrypoints públicos: `tabs-controller`,
  `combobox-controller`, `grid-controller` y `toast-controller`, con contratos ARIA,
  teclado y foco. Documentación como producto (referencia por componente, contratos
  de accesibilidad, guía de migración, madurez, búsqueda y changelog) y batería de
  gates automatizados (axe, navegadores, regresión visual). Se publica `CHANGELOG.md`
  en el paquete.

## 1.0.0

Primera versión pública: tokens, componentes y layouts en CSS, con primitivas
accesibles y una batería de gates automatizados.

### Añadido

- Tokens de diseño (DTCG) como fuente única, con temas light, dark y
  high-contrast y preset de Tailwind.
- Bundle CSS por capas (`@layer`), reset, utilidades y 49 componentes.
- Primitivas ESM sin dependencias: overlay, disclosure, tabs, combobox, grid y
  toast, con contratos ARIA, teclado y foco.
- Sprite de iconos (`#ro-i-*`) generado desde una fuente única.
- Gates de calidad: tokens, contraste (WCAG AA), inventario de literales, lint,
  baseline, pruebas de comportamiento, axe, navegadores (Chromium/Firefox/WebKit),
  regresión visual y presupuesto de paquete.

### Accesibilidad

- Estados dirigidos por semántica ARIA (`aria-selected`, `aria-expanded`,
  `aria-current`, `hidden`) en lugar de clases de estado.
- Command Palette como combobox modal; Calendar como `role=grid`; Toast con
  regiones vivas.

[1.0.0]: https://github.com/RobertCastro/RoUI/releases/tag/v1.0.0
