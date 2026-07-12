# F2-005: Inventariar y controlar valores literales

- Estado: review
- Fase: 2
- Dependencias: F2-001 a F2-004

## Objetivo

Evitar que colores y medidas de diseño vuelvan a dispersarse fuera de los
tokens, y clasificar las excepciones que aún son necesarias.

## Criterios de aceptación

- [x] Existe inventario reproducible fuera de los tokens generados.
- [x] CI falla ante cambios de literales sin revisión.
- [x] Las excepciones están documentadas.
- [x] Las migraciones pendientes están priorizadas.

## Cierre

- Baseline: 39 literales de color y 382 valores `px` fuera de tokens.
- Gate: una huella SHA-256 bloquea cambios no revisados en el inventario.
- Excepciones: overlays, gradientes, SVG embebido y geometría local están
  documentados con orden de migración.
- Comandos: `npm run check:literals`, `npm run validate`, `git diff --check`.
- Siguiente paso: auditoría de cierre de Fase 2.
