# F4-003: Teclado en navegador de Tabs, Combobox y Calendar

- Estado: review
- Fase: 4
- Dependencias: F3-004, F3-005, F4-002
- ADR relacionados: ADR-0005

## Objetivo

Verificar en navegador real la navegación por teclado de los patrones compuestos
no modales: Tabs (roving tabindex), Combobox (listbox + `aria-activedescendant`) y
Calendar (`role=grid` 2D).

## Contexto

F4-002 cubrió los overlays modales; falta ejercitar los controladores no modales
(`tabs-controller`, `combobox-controller`, `grid-controller`) en un navegador:
flechas, `Home`/`End`, activación automática, opción activa sin mover el foco y
selección en cuadrícula. Reutiliza la infraestructura de Playwright de F4-002.

## Alcance

- Incluido: specs en `test/e2e/` para Tabs, Combobox y Calendar sobre la galería.
- Excluido: regresión visual (F4-004) y la matriz de navegadores/temas/RTL/zoom
  (F4-005). Sin dependencias nuevas.

## Cobertura

- Tabs: pestaña seleccionada tabbable con su panel visible; flechas mueven el foco
  y activan el panel (activación automática); `Home`/`End`; envoltura circular;
  solo la pestaña activa es tabbable.
- Combobox: al enfocar abre la lista; filtra al escribir; las flechas activan una
  opción (`aria-activedescendant`) sin sacar el foco del input; `Enter` selecciona
  y cierra; `Escape` cierra.
- Calendar: el día seleccionado es el tabbable inicial; flechas por día y por
  semana; `Home`/`End` por semana; `Enter` selecciona (`aria-selected`).

## Criterios de aceptación

- [x] 13 pruebas de navegador verdes (27 en total con F4-002).
- [x] Cubren roving tabindex, activación automática, `aria-activedescendant` y grid 2D.
- [x] Sin dependencias nuevas; corren en el job `e2e` existente.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validación

```bash
npm run test:e2e
npm run validate
git diff --check
```

## Cierre

- Resultado: 13 specs de navegador para Tabs, Combobox y Calendar que verifican el
  teclado de los controladores no modales; suite e2e total en 27.
- Archivos modificados: `test/e2e/{tabs,combobox,calendar}.spec.mjs` (nuevos),
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run test:e2e`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: solo Chromium; regresión visual y matriz completa en
  F4-004/005.
- Siguiente tarea desbloqueada: F4-004 (regresión visual de componentes y
  plantillas).
