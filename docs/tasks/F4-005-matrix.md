# F4-005: Matriz de navegadores, temas y RTL

- Estado: review
- Fase: 4
- Dependencias: F4-002, F4-003
- ADR relacionados: ADR-0005

## Objetivo

Ampliar la cobertura de navegador a una matriz: los tres motores (Chromium,
Firefox, WebKit), los tres temas y la dirección RTL, para detectar regresiones
específicas de motor, tema o dirección.

## Contexto

F4-002/003 corrían solo en Chromium. Faltaba confirmar que foco, teclado y
overlays se comportan igual en Firefox y WebKit, que los temas remapean tokens en
el navegador y que la librería de componentes soporta RTL.

## Alcance

- Incluido: proyectos `firefox` y `webkit` en la config funcional (toda la suite
  e2e corre en los tres motores); `themes.spec.mjs` (remapeo de tokens semánticos
  por tema); `rtl.spec.mjs` (RTL sin scroll horizontal en las páginas
  representativas de componentes); `@axe-core/playwright` disponible para axe en
  render real; CI instala los tres navegadores.
- Excluido: axe de contraste sobre las demos con tema forzado (ver Notas); el
  pulido de RTL/reflow de las plantillas (tarea de seguimiento).

## Cobertura

- Navegadores: las 32 pruebas funcionales (smoke, overlays, command palette, tabs,
  combobox, calendar) corren en Chromium, Firefox y WebKit → 96 en total.
- Temas: `data-ro-theme` en `light`/`dark`/`high-contrast` remapea `--ro-bg`,
  `--ro-text` y `--ro-surface` a los valores esperados en los tres motores.
- RTL: `docs/components.html` y `docs/templates/module-3col.html` no generan scroll
  horizontal con `dir="rtl"`.

## Notas y límites

- Contraste por tema: el contraste AA de cada par de tokens ya lo gatea
  `check:contrast` (F2-004) sobre los tres temas. Ejecutar axe de contraste con el
  tema forzado sobre las páginas de docs produce falsos positivos: las demos usan
  el color crudo `--ro-ink` en lugar del semántico `--ro-text`, de modo que no
  están pensadas para conmutar de tema. Hacer las demos plenamente tematizables es
  un trabajo aparte, no de esta tarea.
- Reflow a 320 px y RTL del template de dashboard: exponen anchos fijos del
  contenido de demostración (tarjetas con ancho mínimo, bloques `<pre>` de código
  sin `overflow-x`), no de los primitivos de layout. Se registra como tarea de
  seguimiento de responsividad de plantillas.

## Criterios de aceptación

- [x] La suite funcional corre en Chromium, Firefox y WebKit (96 verdes).
- [x] Los tres temas remapean los tokens semánticos en el navegador.
- [x] RTL sin scroll horizontal en las páginas de componentes.
- [x] CI instala y ejecuta los tres navegadores.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validación

```bash
npm run test:e2e
npm run validate
git diff --check
```

## Cierre

- Resultado: matriz de navegador (3 motores × 32 pruebas = 96), verificación de
  remapeo de temas y RTL sin desbordes en las páginas de componentes.
- Archivos modificados: `playwright.config.mjs` (proyectos firefox/webkit),
  `test/e2e/{themes,rtl}.spec.mjs` (nuevos), `package.json`
  (devDep `@axe-core/playwright`), `package-lock.json`,
  `.github/workflows/ci.yml` (instala 3 navegadores),
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run test:e2e`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: pulido de RTL/reflow de plantillas (tarea de seguimiento);
  axe de contraste por tema requiere demos tematizables.
- Siguiente: cierre de Fase 4 (auditoría) tras decidir el alcance del pulido de
  reflow/temas.
