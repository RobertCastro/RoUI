# Auditoria de cierre — Fase 3

- Fecha: 2026-07-18
- Estado: approved
- Rango: PR #18 (F3-001..003) y rama `feat/f3-006-toast-live-region`
  (F3-004..006, commits `a9ab286`, `0628ab1`, `d105808`, `d0cdb25`, `1b8f624`)

## Objetivo auditado

Convertir los componentes visuales en contratos de interaccion completos,
accesibles por teclado y utilizables desde distintos stacks, con primitivas o
controladores verificables para los patrones compuestos.

## Entregables

| Tarea | Resultado | Evidencia |
|---|---|---|
| F3-001 | Contratos de Button y Form nativos | done |
| F3-002 | Dialog y Drawer con foco, Escape y restauracion | done, PR #18 |
| F3-003 | Menu, Popover y Tooltip | done |
| F3-004 | Tabs, Accordion y navegacion (roving, disclosure persistente) | done, `a9ab286` |
| F3-005 | Combobox, Calendar y Command Palette | done, `0628ab1`..`d0cdb25` |
| F3-006 | Toast con regiones vivas y cierre pausable | done, `1b8f624` |

## Primitivas publicadas

`overlay-controller`, `disclosure-controller`, `tabs-controller`,
`combobox-controller` (con modo `inline`), `grid-controller` y `toast-controller`.
Todas ESM sin dependencias, empaquetadas en `dist/primitives/` y expuestas por
`exports`.

## Evidencia de calidad

- `npm run validate` verde: tokens, contraste, literales, build, lint, baseline,
  **30 pruebas de comportamiento**, tarball CJS/ESM, fixtures consumidoras y
  presupuesto.
- Cobertura de teclado por primitiva: foco inicial, `Tab`/`Shift+Tab`, `Escape`,
  restauracion del disparador, roving tabindex (Tabs, Grid), `aria-activedescendant`
  (Combobox), disclosure persistente (Accordion) y regiones vivas (Toast).
- Verificacion manual de navegador y lector de pantalla aprobada por el usuario el
  2026-07-18, siguiendo `manual-verification-f3.md`.
- Presupuesto de paquete: 273 153 / 278 528 bytes descomprimidos tras excluir del
  tarball `src/icons/icons.json` (fuente de build, no API publica).

## Cambios de contrato

- Estados dirigidos por semantica (`aria-selected`, `aria-expanded`,
  `aria-current`, `aria-activedescendant`, `[hidden]`), no por clases de demo.
- Command Palette es un combobox `inline` dentro de un `role=dialog` modal.
- Calendar es `role=grid` con navegacion por teclado.
- Toast se anuncia por `role=status`/`role=alert` sin trasladar el foco.

## Riesgos transferidos a Fase 4

- Falta la matriz integral: axe automatizado, Playwright, regresion visual,
  navegadores, RTL, temas, zoom y tamanos. Es el objetivo de Fase 4.
- F3-004/005/006 estan verificadas y en `done`, pero su integracion a `main` via
  PR queda como paso mecanico pendiente.
- El presupuesto conserva ~5,2 KiB de margen descomprimido; nuevos artefactos
  deben reducir contenido o justificar el cambio.

## Recomendacion

Aprobar el cierre de Fase 3 y abrir Fase 4 (sistema integral de pruebas),
empezando por axe automatizado y pruebas de navegador sobre las primitivas ya
publicadas.

## Aprobacion humana

- [x] Entregables de Fase 3 verificados y aceptados por el usuario el 2026-07-18.
- [x] Riesgos transferidos a Fase 4 aceptados.
- [x] Autorizada la apertura de Fase 4.
