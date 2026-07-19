# Changelog

Todas las novedades relevantes de RoUI. El formato sigue
[Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el versionado es
[SemVer](https://semver.org/lang/es/). Releases y etiquetas en
[GitHub](https://github.com/RobertCastro/RoUI/releases).

## [Sin publicar]

### Añadido

- Referencia por componente generada desde manifiesto (contrato, API, teclado,
  ejemplos, do/don't y madurez).
- Contratos de accesibilidad renderizados y enlazados desde cada componente.
- Guía de migración de los patrones de clase retirados en Fase 3.
- Búsqueda de componentes y navegación por versiones en el sitio de docs.

## [1.0.0]

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

[Sin publicar]: https://github.com/RobertCastro/RoUI/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/RobertCastro/RoUI/releases/tag/v1.0.0
