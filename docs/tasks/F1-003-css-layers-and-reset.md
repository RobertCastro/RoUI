# F1-003: Aislar reset e introducir cascade layers

- Estado: review
- Fase: 1
- Dependencias: F1-002
- ADR relacionados: ADR-0002

## Objetivo

Evitar efectos globales involuntarios y definir un orden de cascada estable.

## Criterios de aceptacion

- [x] Reset se importa explicitamente y no forma parte del bundle agregado.
- [x] Existen layers para reset, tokens, base, layouts, components y utilities.
- [x] La fixture demuestra que el bundle no contiene los selectores globales del reset.
- [x] README explica orden, importacion y precedencia de personalizacion.

## Cierre

- Resultado: bundle agregado sin reset y con cascade layers explicitas.
- Build: conserva las capas al aplanar los 59 imports del source.
- Prueba: el tarball verifica layers, ausencia de reset en bundle y presencia en
  `reset.css`.
- Comandos: `npm run validate`, `git diff --check`.
- Siguiente tarea: F1-004, ampliar fixtures consumidoras.
