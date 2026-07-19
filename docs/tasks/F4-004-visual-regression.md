# F4-004: Regresión visual de componentes y plantillas

- Estado: review
- Fase: 4
- Dependencias: F4-002
- ADR relacionados: ADR-0005

## Objetivo

Detectar regresiones visuales no intencionadas en la galería de componentes y las
plantillas mediante snapshots de imagen comparados pixel a pixel.

## Contexto

Los gates axe (F4-001) y de teclado (F4-002/003) no ven cambios puramente
visuales: un color, un espaciado o un borde que se rompe al editar tokens o CSS.
Falta una red de seguridad de imagen sobre el estado renderizado.

## Decisión: snapshots por plataforma, gate fuera del CI bloqueante

Los snapshots dependen del SO y del motor de render. Playwright los sufija con la
plataforma (`*-chromium-darwin.png`). Para evitar falsos positivos entre macOS
(desarrollo) y Linux (CI):

- Se versionan las referencias generadas en desarrollo (`darwin`).
- El gate visual **no** entra en el CI de PR obligatorio.
- Un workflow manual (`visual.yml`, `workflow_dispatch`) corre la suite en el
  contenedor oficial `mcr.microsoft.com/playwright` (Linux), reproducible. Con el
  input `update` genera las baselines de Linux y las sube como artefacto para
  versionarlas; sin él, compara contra las existentes.

## Alcance

- Incluido: `playwright.visual.config.mjs`, `test/visual/pages.spec.mjs` (7 páginas
  de docs a página completa), script `test:visual`, baselines `darwin` y el
  workflow manual de Linux.
- Excluido: snapshots por componente aislado, temas/RTL/zoom (F4-005) y la
  integración de las baselines de Linux (se generan al ejecutar el workflow).

## Cobertura

Snapshots de página completa: `index`, `tokens`, `icons`, `layouts`, `components`,
`templates/dashboard` y `templates/module-3col`. Animaciones deshabilitadas,
`prefers-reduced-motion`, viewport 1280×900 y espera a `document.fonts.ready`;
tolerancia `maxDiffPixelRatio: 0.02` para subpíxeles del mismo SO.

## Criterios de aceptación

- [x] `test:visual` compara 7 páginas y falla ante diferencias sobre el umbral.
- [x] Baselines `darwin` versionadas y estables en re-ejecución.
- [x] Config separada: `test:e2e` no depende de imágenes.
- [x] Workflow manual reproducible en Linux (contenedor de Playwright).
- [x] `npm run validate` y `git diff --check` verdes; sin fugas al tarball.

## Plan de validación

```bash
npm run test:visual                 # compara contra baselines darwin
npm run test:visual -- --update-snapshots   # regenera baselines (tras cambios visuales intencionados)
npm run validate
git diff --check
```

## Cierre

- Resultado: regresión visual con Playwright sobre 7 páginas; baselines `darwin`
  versionadas y workflow manual para baselines de Linux en el contenedor oficial.
- Archivos modificados: `playwright.visual.config.mjs` (nuevo),
  `test/visual/pages.spec.mjs` (nuevo), `test/visual/pages.spec.mjs-snapshots/*.png`
  (baselines), `package.json` (`test:visual`), `.github/workflows/visual.yml`
  (nuevo), `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run test:visual` (con y sin `--update-snapshots`),
  `npm run validate`, `git diff --check`.
- Riesgos pendientes: baselines de Linux para el CI se generan al correr el
  workflow manual; snapshots por componente y temas/RTL/zoom en F4-005.
- Siguiente tarea desbloqueada: F4-005 (matriz de navegadores, temas, RTL y zoom).
