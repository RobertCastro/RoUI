# Fase activa: 0 — Sistema de ejecucion y baseline

## Objetivo

Crear el contexto persistente y los mecanismos que permitan a personas y LLM
ejecutar el roadmap sin perder alcance, decisiones ni evidencia.

## Trabajo permitido

- Documentacion de vision, principios, arquitectura y calidad.
- ADR propuestos para decisiones fundamentales.
- Inventario y baseline verificable del repositorio actual.
- Definicion de compatibilidad y metricas.
- Plantillas de tareas y cierre de sesion.
- CI minima que valide el estado actual sin forzar aun la arquitectura destino.

## Fuera de alcance

- Migrar a monorepo.
- Crear adaptadores React, Vue o Web Components.
- Implementar temas nuevos.
- Redisenar componentes.
- Agregar nuevos componentes por iniciativa de esta fase.
- Aplicar ADR propuestos antes de aceptarlos.

## Baseline provisional

```bash
npm run build
NPM_CONFIG_CACHE=/tmp/roui-npm-cache npm pack --dry-run
```

Este baseline se ampliara cuando existan linters y pruebas.

## Condiciones de salida

- Todos los entregables F0 estan en `verified`.
- Los ADR fundamentales fueron aceptados o rechazados explicitamente.
- Existe inventario de componentes y riesgos.
- CI minima esta verde.
- La Fase 1 tiene tareas pequenas, dependencias y criterios de aceptacion.
- Un revisor humano aprueba el cierre de fase.

