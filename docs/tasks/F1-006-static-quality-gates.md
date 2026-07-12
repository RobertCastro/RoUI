# F1-006: Introducir quality gates estaticos

- Estado: review
- Fase: 1
- Dependencias: F1-002, F1-003

## Objetivo

Incorporar validacion de CSS, formato, contratos de paquete y presupuestos de
tamano sin introducir herramientas que no tengan una responsabilidad clara.

## Criterios de aceptacion

- [x] CSS fuente pasa reglas acordadas de Stylelint.
- [x] CI genera artefactos desde `src` antes de empaquetar.
- [x] Bundle y paquete tienen presupuestos iniciales documentados.
- [x] Fallos conocidos del baseline se vinculan a F2-001 o a Fases 3 y 4.
- [x] Los comandos locales y CI ejecutan `npm run validate`.

## Cierre

- Resultado: lint CSS, presupuesto de paquete y auditoria de produccion en CI.
- Herramienta: Stylelint 16 y reglas de alto valor documentadas por ADR-0005.
- Presupuesto: 64 KiB comprimidos y 256 KiB descomprimidos.
- Comandos: `npm run validate`, `npm audit --omit=dev --json`,
  `git diff --check`.
- Riesgo pendiente: pruebas de comportamiento y accesibilidad se incorporan en
  Fases 3 y 4.
