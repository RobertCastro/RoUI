# F2-003: Migrar componentes a tokens semánticos

- Estado: review
- Fase: 2
- Dependencias: F2-001, F2-002, ADR-0006

## Objetivo

Introducir tokens de componente derivados de roles semánticos y migrar los
controles de mayor uso para que respondan a los temas sin valores duplicados.

## Criterios de aceptación

- [x] `components.css` se genera desde DTCG.
- [x] Button, Card y Form consumen tokens de componente.
- [x] Los tokens de componente derivan de roles semánticos.
- [x] El tarball publica el entrypoint de tokens de componente.
- [x] Se documenta el alcance y la migración restante.

## Cierre

- Resultado: 25 tokens de componente para acciones, superficies y controles.
- Migración: Button, Card y Form usan los nuevos tokens; los componentes
  restantes se migrarán por grupos en tareas posteriores de Fase 2.
- Prueba: `component-tokens.css` se resuelve desde el tarball y los consumidores
  continúan compilando.
- Comandos: `npm run check:tokens`, `npm run validate`, `git diff --check`.
- Riesgo: quedan ~2.7 KiB del presupuesto descomprimido; futuros artefactos
  públicos requieren especial control de tamaño.
