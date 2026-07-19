# F4-002: Pruebas de navegador para overlays (Playwright)

- Estado: review
- Fase: 4
- Dependencias: F3-002, F3-005, F4-001
- ADR relacionados: ADR-0005

## Objetivo

Verificar en un navegador real el comportamiento de foco y teclado de los overlays
modales: Dialog, Drawer (lateral y bottom-sheet) y Command Palette, cubriendo los
estados dinámicos que el gate axe estático (jsdom) no puede evaluar.

## Contexto

F4-001 dejó un gate axe sobre el DOM estático, pero no ejercita interacción: foco
inicial, trap de `Tab`, `Escape`, restauración del foco, backdrop ni el atajo de
la paleta. Estas rutas viven en `overlay-controller` y `combobox-controller` y
necesitan un navegador para validarse.

## Alcance

- Incluido: `@playwright/test` + Chromium, `playwright.config.mjs` (levanta el
  sitio de docs con el mismo servidor que `npm start`), specs en `test/e2e/` para
  Dialog, Drawer, Bottom-sheet y Command Palette, script `test:e2e` y un job de CI
  dedicado que instala el navegador.
- Excluido: navegación de teclado de Tabs/Combobox/Calendar (F4-003), regresión
  visual (F4-004) y la matriz de navegadores/temas/RTL/zoom (F4-005).

## Decisión: e2e fuera de `validate`

`validate` se mantiene como gate rápido y sin navegador (lo corre cada desarrollador
y el job `baseline`). Las pruebas de navegador se ejecutan con `npm run test:e2e`
en un job de CI separado (`e2e`) que instala Chromium con `npx playwright install
--with-deps chromium`. Playwright y el navegador son dev-only: no entran al tarball
(`files` no los incluye) ni a la auditoría de producción.

## Cobertura

- Dialog: abre con foco en el panel, marca `aria-expanded`, atrapa `Tab` en ciclo,
  cierra con `Escape` y con controles `data-ro-overlay-close`, y restaura el foco.
- Drawer lateral: abre, cierra con `Escape` y con clic en el backdrop, restaura el
  foco.
- Bottom-sheet: abre y cierra con su botón, restaura el foco.
- Command Palette: abre como `role=dialog` modal con el input enfocado y con el
  atajo `Ctrl/Cmd+K`; filtra opciones; las flechas mueven `aria-activedescendant`
  sin sacar el foco del input; `Escape` cierra y restaura el foco; `Enter`
  selecciona y cierra.

## Criterios de aceptación

- [x] 14 pruebas de navegador verdes en Chromium.
- [x] `playwright.config.mjs` levanta el sitio y reusa un server local existente.
- [x] Script `test:e2e` y job de CI `e2e` que instala el navegador.
- [x] Artefactos de Playwright ignorados en git; sin fugas al tarball.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validación

```bash
npm run test:e2e
npm run validate
git diff --check
```

## Cierre

- Resultado: suite de navegador (14 specs) que verifica foco, `Tab` trap, `Escape`,
  backdrop, restauración del foco y el atajo de la paleta para Dialog, Drawer,
  Bottom-sheet y Command Palette.
- Archivos modificados: `playwright.config.mjs` (nuevo),
  `test/e2e/{smoke,overlays,command-palette}.spec.mjs` (nuevos), `package.json`
  (script `test:e2e` + devDep `@playwright/test`), `package-lock.json`,
  `.gitignore`, `.github/workflows/ci.yml` (job `e2e`),
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run test:e2e`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: solo Chromium por ahora; Firefox/WebKit y la matriz completa
  llegan en F4-005.
- Siguiente tarea desbloqueada: F4-003 (teclado de Tabs, Combobox y Calendar en
  navegador).
