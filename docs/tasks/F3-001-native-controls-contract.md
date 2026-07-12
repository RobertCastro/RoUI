# F3-001: Contratos accesibles para Button y Form

- Estado: review
- Fase: 3
- Dependencias: F2-003, F2-004

## Objetivo

Definir y aplicar el contrato accesible de los controles nativos estilizados
por RoUI, sin reemplazar semántica HTML con elementos genéricos.

## Criterios de aceptación

- [x] Button documenta elemento nativo, nombre accesible, disabled y busy.
- [x] Form documenta label, descripción, error, required e invalid.
- [x] CSS cubre estados ARIA y preserva foco visible.
- [x] No se recomienda emular controles nativos con `div` o `span`.
- [x] Ejemplos son copiables y usan semántica correcta.

## Cierre

- Contrato: documentación para semántica HTML, nombre accesible, carga, errores
  y asociación de ayudas con `aria-describedby`.
- CSS: soporta `aria-busy`, `aria-disabled` y `aria-invalid` sin ocultar foco.
- Comandos: `npm run validate`, `git diff --check`.
- Siguiente tarea: Dialog y Drawer con foco y restauración.
