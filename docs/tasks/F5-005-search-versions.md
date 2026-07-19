# F5-005: Búsqueda y navegación por versiones

- Estado: review
- Fase: 5
- Dependencias: F5-001..004
- ADR relacionados: ADR-0005

## Objetivo

Permitir encontrar un componente por nombre, clase o descripción, y navegar el
historial de versiones desde el sitio de documentación.

## Contexto

La referencia crece (componentes, contratos, guías) y no había forma de buscar ni
un lugar donde ver la versión y el historial de cambios.

## Alcance

- Incluido: buscador cliente en el índice de referencia (filtra tarjetas por
  nombre, título, familia, resumen y clases, sin dependencias); indicador de
  versión (desde `package.json`) enlazado al changelog; `CHANGELOG.md` (Keep a
  Changelog) renderizado a `changelog.html` y enlazado; inclusión de `CHANGELOG.md`
  en el paquete publicado.
- Excluido: hospedaje de documentación multi-versión (requiere pipeline de
  release; se aborda en Fase 6).

## Progreso

- [x] Buscador en el índice (`data-search` por tarjeta + filtro por familia).
- [x] Versión inyectada desde `package.json` y enlazada al changelog.
- [x] `CHANGELOG.md` creado y renderizado; enlazado desde el índice.
- [x] `CHANGELOG.md` añadido a `files` del paquete.

## Criterios de aceptacion

- [x] Buscar filtra tarjetas y oculta familias sin resultados, con mensaje vacío.
- [x] El índice muestra la versión y enlaza el changelog.
- [x] El changelog se ve como página del sitio y pasa axe.
- [x] `npm run validate` y `git diff --check` verdes dentro del presupuesto.

## Plan de validacion

```bash
npm run build:reference
npm run validate
git diff --check
```

## Notas

- Bug corregido: `.dx-ref-card { display: flex }` anulaba el `[hidden]` del
  user-agent (mayor especificidad); se añadió `.dx-ref-card[hidden] { display: none }`
  para que el filtro oculte de verdad.

## Cierre

- Resultado: buscador cliente sobre la referencia, indicador de versión y changelog
  navegable renderizado desde `CHANGELOG.md`.
- Archivos: `scripts/build-reference.mjs` (búsqueda, versión, changelog),
  `CHANGELOG.md` (nuevo), `docs/assets/docs.css` (buscador, versión, fix `[hidden]`),
  `package.json` (`files` incluye CHANGELOG), páginas generadas,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: documentación multi-versión y 40 componentes por documentar.
- Siguiente: cierre de Fase 5 (auditoría) y continuación de manifiestos por lotes.
