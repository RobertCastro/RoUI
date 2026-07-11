# Fase activa: 1 — Fundamentos y empaquetado

## Objetivo

Hacer que RoUI se distribuya de forma reproducible, granular y segura antes de
transformar tokens o crear adaptadores de componentes.

## Trabajo permitido

- Corregir formatos ESM/CommonJS y exports publicos.
- Crear fixtures que instalen y prueben el tarball.
- Separar reset, tokens, componentes y bundle completo.
- Introducir cascade layers y aislar efectos globales.
- Decidir la estructura minima de workspace mediante ADR.
- Incorporar quality gates estaticos y presupuestos iniciales.
- Realizar breaking changes documentados, pues no hay consumidores estables.

## Fuera de alcance

- Migrar tokens a DTCG; corresponde a Fase 2.
- Implementar temas dark/high contrast.
- Crear adaptadores React, Vue o Web Components.
- Implementar comportamiento accesible complejo de componentes.
- Agregar componentes visuales nuevos.

## Orden de tareas

1. F1-001: contrato Tailwind.
2. F1-002: entrypoints CSS publicos.
3. F1-003: reset y cascade layers.
4. F1-004: fixtures consumidoras completas.
5. F1-005: decision de workspace.
6. F1-006: quality gates estaticos.

## Baseline

```bash
npm run validate
NPM_CONFIG_CACHE=/tmp/roui-npm-cache npm pack --dry-run
```

## Condiciones de salida

- Todos los entrypoints publicos se prueban desde un tarball.
- Reset es opt-in y el orden de cascada esta documentado.
- Tailwind carga con el contrato soportado.
- CI valida build, paquete, fixtures y gates estaticos acordados.
- Arquitectura de workspace tiene ADR aceptado.
- Auditoria humana aprueba el cierre de Fase 1.
