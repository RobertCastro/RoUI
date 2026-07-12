# F1-005: Decidir y preparar estructura de workspace

- Estado: review
- Fase: 1
- Dependencias: F1-001 a F1-004

## Objetivo

Decidir mediante ADR si la separacion actual exige monorepo y ejecutar solo la
estructura minima que reduzca acoplamiento sin complejidad prematura.

## Criterios de aceptacion

- [x] ADR compara repositorio unico, workspaces y herramientas de orquestacion.
- [x] La opcion elegida tiene propietario, costos y estrategia de cache.
- [x] No aplica migracion: build y fixtures permanecen verdes en repositorio unico.
- [x] No se crean paquetes vacios sin consumidor o responsabilidad definida.

## Cierre

- Resultado: se mantiene repositorio unico; npm workspaces se adopta solo con
  dos paquetes independientes y criterios documentados.
- Evidencia: ADR-0004 y `workspace-readiness.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Siguiente tarea: F1-006, quality gates estaticos.
