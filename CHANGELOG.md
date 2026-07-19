# Changelog

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
