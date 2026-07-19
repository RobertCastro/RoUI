# F5-004: Madurez, do/don't y guía de migración

- Estado: done
- Fase: 5
- Dependencias: F5-001, F5-002, F5-003
- ADR relacionados: ADR-0005

## Objetivo

Formalizar la madurez en la referencia, documentar los cambios incompatibles en
una guía de migración y ampliar la cobertura de componentes.

## Contexto

La madurez era solo un badge sin criterio visible, no había guía para migrar de
los patrones de clase retirados en Fase 3, y el do/don't ya vivía por componente
desde F5-001. Faltaba consolidarlo.

## Alcance

- Incluido: leyenda de niveles de madurez y criterio de promoción en el índice;
  sección "Madurez" por página (nivel + qué significa + enlaces); guía de
  migración (`migration.md` → `migration.html`) con los cambios incompatibles
  Tabs/Nav/Accordion/Combobox/Command Palette/Calendar/Toast; segundo lote de
  manifiestos (drawer, popover, menu) con demos interactivas. 9/49 documentados.
- Excluido: adaptadores por framework; navegación por versiones (F5-005); resto
  de componentes (lotes siguientes).

## Progreso

- [x] Leyenda de madurez + criterio de promoción en el índice (`#madurez`).
- [x] Sección "Madurez" por componente con enlace a criterios y migración.
- [x] Guía de migración renderizada y enlazada desde el índice y cada componente.
- [x] Lote drawer/popover/menu con demos interactivas (disclosure/overlay).

## Criterios de aceptacion

- [x] El índice explica los 4 niveles y el criterio de promoción.
- [x] Cada componente muestra su madurez y enlaza migración y criterios.
- [x] La guía de migración lista el antes/ahora de los patrones retirados.
- [x] Las demos de drawer/popover/menu son interactivas (verificado).
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run build:reference
npm run validate
git diff --check
```

## Cierre

- Resultado: madurez formalizada (leyenda + criterio + sección por página), guía
  de migración de los cambios incompatibles de Fase 3, y 3 componentes nuevos
  interactivos (drawer, popover, menu). 9/49 documentados.
- Archivos: `scripts/build-reference.mjs` (madurez, migración, `prosePage`),
  `docs/reference/migration.md` (nuevo), `docs/assets/docs.css` (estilos madurez),
  `docs/reference/components/{drawer,popover,menu}.json`, páginas generadas,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: 40 componentes por documentar; búsqueda y versiones en F5-005.
- Siguiente tarea desbloqueada: F5-005 (búsqueda y navegación por versiones).
