# F1-003: Aislar reset e introducir cascade layers

- Estado: backlog
- Fase: 1
- Dependencias: F1-002
- ADR relacionados: ADR-0002

## Objetivo

Evitar efectos globales involuntarios y definir un orden de cascada estable.

## Criterios de aceptacion

- [ ] Reset se importa explicitamente o queda acotado al root documentado.
- [ ] Existen layers para reset, tokens, base, components y utilities.
- [ ] Una fixture demuestra que elementos externos no cambian al importar core.
- [ ] Documentacion explica orden y personalizacion.

