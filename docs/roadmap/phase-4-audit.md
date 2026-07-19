# Auditoria de cierre — Fase 4

- Fecha: 2026-07-18
- Estado: draft (pendiente de auditoria humana y del merge del PR #19)
- Rango: PR #19 (rama `feat/f4-005-matrix`, commits `caea05f`..`30b2425`)

## Objetivo auditado

Convertir la calidad visual, funcional y accesible en gates automatizados y
reproducibles sobre las primitivas y componentes publicados en Fase 3.

## Entregables

| Tarea | Resultado | Evidencia |
|---|---|---|
| F4-001 | Gate axe estatico (axe-core + jsdom) en `validate` y CI | done, `caea05f` |
| F4-002 | Playwright: overlays (Dialog, Drawer, Command Palette) | done, `131d786` |
| F4-003 | Playwright: teclado de Tabs, Combobox y Calendar | done, `dc1568d` |
| F4-004 | Regresion visual de 7 paginas (baselines darwin + workflow Linux) | done, `4209ca5` |
| F4-005 | Matriz: Chromium/Firefox/WebKit, temas y RTL | done, `30b2425` |

## Evidencia de calidad

- `npm run validate` verde: tokens, contraste, literales, build, lint, baseline,
  30 pruebas de nodo, tarball CJS/ESM, fixtures, **axe** y presupuesto.
- `npm run test:e2e`: 96 pruebas verdes en los tres motores (32 x 3).
- `npm run test:visual`: 7 paginas sin regresion contra baselines `darwin`.
- CI del PR #19: jobs `baseline` (31s) y `e2e` con los tres navegadores (1m43s)
  en verde; primera ejecucion de la matriz en Linux.
- Presupuesto de paquete dentro de limite; dev-deps (axe-core, jsdom, Playwright,
  @axe-core/playwright) no entran al tarball.

## Cobertura por gate

- Accesibilidad estatica: axe sobre 7 paginas (roles, nombres, landmarks,
  jerarquia de encabezados); 40 nodos corregidos.
- Comportamiento en navegador: foco, `Tab` trap, `Escape`, backdrop, restauracion
  del foco, atajo `Ctrl/Cmd+K`, roving tabindex, `aria-activedescendant` y grid 2D.
- Regresion visual: pagina completa, animaciones deshabilitadas, viewport fijo.
- Matriz: tres motores, remapeo de tokens por tema y RTL sin scroll horizontal en
  las paginas de componentes.

## Limites y riesgos transferidos

- Contraste por tema: se gatea a nivel de tokens en `check:contrast`. Las demos
  usan `--ro-ink` crudo en vez de `--ro-text`, por lo que no son tematizables sin
  un refactor; queda fuera de esta fase.
- Reflow a 320 px y RTL del template de dashboard: exponen anchos fijos del
  contenido de demostracion (tarjetas, bloques `<pre>`), no de los primitivos.
  Tarea de seguimiento de responsividad de plantillas.
- Baselines visuales de Linux: se generan con el workflow manual `visual.yml`; el
  gate visual no bloquea PRs por ser sensible al SO.

## Recomendacion

Aprobar el cierre de Fase 4 tras el merge del PR #19 y abrir Fase 5 (documentacion
como producto), arrastrando las dos tareas de seguimiento (tematizacion de demos y
responsividad de plantillas) al backlog correspondiente.

## Aprobacion humana

- [ ] Entregables de Fase 4 verificados y aceptados por el usuario.
- [ ] Riesgos y tareas de seguimiento aceptados.
- [ ] PR #19 integrado en `main`.
- [ ] Autorizada la apertura de Fase 5.
