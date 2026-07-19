# F5-002: Contratos de accesibilidad enlazados y primer lote de manifiestos

- Estado: review
- Fase: 5
- Dependencias: F5-001
- ADR relacionados: ADR-0005

## Objetivo

Hacer que cada componente enlace su contrato de accesibilidad renderizado y
ampliar la referencia con un primer lote de componentes documentados.

## Contexto

F5-001 dejó la estructura y el ejemplar Button, pero los contratos de
accesibilidad seguían solo como `.md` (no se ven en el sitio) y solo había un
componente documentado.

## Alcance

- Incluido: renderizado de los 6 contratos `docs/accessibility/*.md` a HTML del
  sitio (marked + `ro-prose`); enlace desde la sección de teclado/a11y de cada
  componente a su contrato `.html`; listado de contratos en el índice; inyección
  del sprite en las páginas de componente (demos con icono); primer lote de
  manifiestos (button-group, toolbar, alert, tooltip); contratos y páginas nuevas
  en los gates axe y `check:reference`.
- Excluido: documentar los 44 componentes restantes (lotes siguientes); ejemplos
  interactivos con JS en la referencia (F5-003); navegación por versiones (F5-005).

## Progreso

- [x] `marked` (dev-only) renderiza los contratos a `docs/accessibility/*.html`.
- [x] El generador enlaza `a11y.contract` a la versión `.html`.
- [x] Índice con sección "Contratos de accesibilidad".
- [x] Sprite inyectado en las páginas de componente (iconos en demos).
- [x] Lote: button-group, toolbar (native-controls), alert (toast), tooltip
  (menu-popover-tooltip). 5/49 documentados.

## Criterios de aceptacion

- [x] Los 6 contratos se ven como páginas del sitio y pasan axe.
- [x] Cada componente documentado enlaza su contrato renderizado.
- [x] Las demos con icono renderizan (sprite inyectado).
- [x] `check:reference` cubre contratos y páginas; axe cubre 15 páginas.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run build:reference
npm run check:reference
npm run validate
git diff --check
```

## Cierre

- Resultado: 6 contratos de accesibilidad renderizados y enlazados desde los
  componentes; primer lote de manifiestos (5/49 documentados) con contrato,
  teclado y demos vivas con icono.
- Archivos: `scripts/build-reference.mjs` (contratos + sprite + índice),
  `scripts/check-axe.mjs` (incluye accessibility), `package.json`
  (dev-dep `marked`), `docs/reference/components/{button-group,toolbar,alert,tooltip}.json`,
  páginas generadas en `docs/reference/` y `docs/accessibility/`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: 44 componentes sin manifiesto; demos interactivas (overlays,
  combobox) requieren JS en la referencia, previsto en F5-003.
- Siguiente tarea desbloqueada: F5-003 (ejemplos verificables / copiar-pegar por
  componente).
