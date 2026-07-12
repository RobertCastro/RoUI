# Auditoria de cierre — Fase 1

- Fecha: 2026-07-11
- Estado: approved
- Rango: PR #2 a PR #7

## Objetivo auditado

Hacer que RoUI se distribuya de forma reproducible, granular y segura antes de
transformar los tokens o crear adaptadores de componentes.

## Entregables

| Tarea | Resultado | Evidencia |
|---|---|---|
| F1-001 | Preset Tailwind CJS/ESM publicado | PR #2 |
| F1-002 | Entry points CSS públicos y granulares | PR #3 |
| F1-003 | Reset explícito y cascade layers | PR #4 |
| F1-004 | Fixtures esbuild y Tailwind desde tarball | PR #5 |
| F1-005 | Criterios de adopción de workspaces | PR #6, ADR-0004 |
| F1-006 | Lint, presupuesto y auditoría de producción | PR #7, ADR-0005 |

## Evidencia de calidad

- `npm ci` instala dependencias bloqueadas en CI.
- `npm run validate` construye, ejecuta Stylelint, valida CSS, prueba exports,
  instala el tarball en consumidores esbuild/Tailwind y aplica presupuesto.
- CI verde en los seis PR, con el gate final en 18 segundos.
- `npm audit --omit=dev` reporta cero vulnerabilidades.
- Tarball actual: 52,519 bytes comprimido de 65,536 permitidos; 244,849 bytes
  descomprimido de 262,144 permitidos.

## Cambios de contrato relevantes

- Tailwind se publica como `.cjs` y funciona mediante `require()` e `import()`.
- Las rutas públicas incluyen tokens, componentes, layouts, reset, animaciones,
  utilidades e iconos; las rutas internas están bloqueadas.
- El bundle agregado no aplica reset global; `reset.css` es opt-in.
- Node 20 o superior es requisito para tooling.

## Decisiones tomadas

- DTCG seguirá siendo la fuente única de tokens en Fase 2.
- El repositorio se mantiene único hasta que haya dos paquetes independientes.
- esbuild reemplazó Vite para las fixtures tras detectar vulnerabilidades de
  desarrollo en la alternativa inicial.

## Riesgos transferidos a Fase 2 y posteriores

- Los tokens todavía se editan en CSS, JSON y Tailwind: F2-001.
- No existen temas dark o high-contrast: Fase 2.
- Los componentes interactivos todavía no son primitivas accesibles: Fase 3.
- Faltan pruebas de navegador, axe y regresión visual: Fase 4.
- La documentación contractual completa se entrega en Fase 5.

## Recomendación

Aprobar el cierre de Fase 1 y abrir Fase 2 con F2-001. La primera decisión de
Fase 2 será elegir y validar el formato DTCG exacto y su transformador.

## Aprobación humana

- [x] Entregables de Fase 1 aceptados por el usuario el 2026-07-11.
- [x] Riesgos transferidos aceptados.
- [x] Autorizada apertura de Fase 2.
