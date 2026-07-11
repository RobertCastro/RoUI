# ADR-0001: Fuente unica de design tokens

- Estado: proposed
- Fecha: 2026-07-10
- Fase: 0

## Contexto

Los valores se mantienen actualmente en CSS, `tokens/tokens.json` y el preset
de Tailwind. La duplicacion permite divergencias silenciosas.

## Decision propuesta

Adoptar un documento compatible con DTCG como unica fuente editable. Generar
desde el todas las salidas publicas: variables CSS, JSON distribuible,
TypeScript y configuracion Tailwind.

Los artefactos generados incluiran cabecera de no edicion y CI verificara que
el repositorio este actualizado despues de ejecutar el generador.

## Alternativas

- CSS como fuente: simple para web, insuficiente para validacion y otras salidas.
- Mantener sincronizacion manual: bajo costo inicial, alto riesgo acumulativo.

## Consecuencias

- Se necesitara esquema, transformador y pruebas de snapshots.
- Los nombres actuales requeriran mapeo y posible deprecacion.
- Figma y Tailwind consumiran el mismo contrato versionado.

## Validacion requerida

- Cero diferencias entre una segunda ejecucion del generador y Git.
- Pruebas de referencias inexistentes y circulares.
- Aplicaciones ejemplo consumen las salidas publicas.

