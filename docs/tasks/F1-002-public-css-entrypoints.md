# F1-002: Definir entrypoints CSS publicos

- Estado: review
- Fase: 1
- Dependencias: F1-001, ADR-0002
- ADR relacionados: ADR-0002

## Objetivo

Permitir consumo explicito de tokens, fundamentos, reset opcional, componentes
individuales y bundle completo sin rutas internas privadas.

## Criterios de aceptacion

- [x] Todos los entrypoints estan declarados en `exports`.
- [x] Reset es opt-in en consumo granular; el bundle completo lo conserva.
- [x] Cada categoria publica se prueba desde el tarball.
- [x] El bundle completo sigue disponible en `.` y `bundle.css`.
- [x] Rutas internas no documentadas son rechazadas por package exports.

## Cierre

- Resultado: API publica granular para CSS, iconos, tokens y Tailwind.
- Prueba: la fixture instala el tarball, resuelve cada categoria publica y
  verifica que una ruta interna falle con `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Comandos: `npm run validate`, `npm pack --dry-run`, `git diff --check`.
- Riesgo pendiente: el bundle completo contiene reset; F1-003 definira layers y
  aislamiento para composiciones agregadas.
- Siguiente tarea: F1-003, reset y cascade layers.
