# Estado del programa

Ultima actualizacion: 2026-07-18

## Fases

| Fase | Estado | Progreso | Condicion siguiente |
|---|---|---:|---|
| 0. Sistema de ejecucion | done | 100% | Cerrada y aprobada |
| 1. Fundamentos | done | 100% | Cerrada y aprobada |
| 2. Tokens y temas | done | 100% | Cerrada y aprobada |
| 3. Primitivas accesibles | done | 100% | Cerrada y aprobada (phase-3-audit) |
| 4. Pruebas integrales | in-progress | 40% | F4-001/002 en review; sigue F4-003: teclado en navegador |
| 5. Documentacion | backlog | 0% | APIs estables iniciales |
| 6. Releases y gobernanza | backlog | 0% | Pipeline de calidad estable |
| 7. Adopcion | backlog | 0% | Primera release candidata |

## Entregables de Fase 0

| ID | Entregable | Estado |
|---|---|---|
| F0-001 | Manual operativo para agentes | verified |
| F0-002 | Vision y principios | verified |
| F0-003 | Arquitectura objetivo | verified |
| F0-004 | Roadmap, fase activa y control de progreso | verified |
| F0-005 | Definition of Done y estrategia de pruebas | verified |
| F0-006 | ADR de tokens y paquetes | accepted |
| F0-007 | Inventario de componentes y madurez | verified |
| F0-008 | Matriz de soporte | verified |
| F0-009 | Baseline automatizado | verified |
| F0-010 | CI minima de pull requests | verified |
| F0-011 | Backlog detallado de Fase 1 | verified |

## Riesgos activos

- No hay consumidores estables; se permiten breaking changes en Fases 0-2. El
  riesgo se traslada a mantener documentacion y fixtures alineadas.
- ADR-0004 mantiene el repositorio unico hasta que existan dos paquetes con
  responsabilidad y build independientes.
- F3-002 añade un controlador de overlays y pruebas Node; aún falta matriz de
  navegador, axe y regresión visual para declarar primitivas estables.
- El nuevo entrypoint público deja 6.6 KiB de margen descomprimido; nuevos
  artefactos deberán justificar su tamaño o reducir el paquete.

## Evidencia de la última ejecución

- `npm run validate`: correcto; incluye tokens, contraste, inventario de
  literales, build, lint, baseline, primitivas, tarball, fixtures y tamaño.
- Primitivas: pruebas Node cubren foco inicial, `Tab`/`Shift+Tab`, `Escape`,
  cierre, restauración del disparador y, con F3-004, el roving tabindex de Tabs
  (flechas, `Home`/`End`, activación automática/manual) y el disclosure
  persistente del Accordion. Total 12 pruebas verdes.
- Fase 3 cerrada (`done`): F3-001..006 verificados. Verificación manual de
  navegador y lector de pantalla aprobada por el usuario el 2026-07-18 según
  `manual-verification-f3.md`; auditoría en `phase-3-audit.md`. Integración de
  F3-004/005/006 a `main` vía PR queda como paso mecánico pendiente.
- F3-004 (Tabs, Accordion, navegación): contratos ARIA aplicados, `tabs-controller`
  publicado y demos/plantillas migradas; gates automáticos verdes.
- F3-005 (done, 3/3): `combobox-controller` (con modo `inline`) y
  `grid-controller` publicados. Combobox usa `role=combobox`/`listbox`/`option`
  con `aria-activedescendant`; Command Palette es un combobox inline dentro de
  `role=dialog` modal (`overlay-controller`) con atajo `⌘K`; Calendar es
  `role=grid` con roving tabindex y navegación por teclado. 11 pruebas nuevas.
- F3-006 (done): `toast-controller` publicado. Cada toast se inserta como
  región viva (`role=status` para éxito/info, `role=alert` para errores) sin robar
  el foco; cierre automático configurable con pausa en `pointer`/`focus`, botón de
  cierre accesible e icono inyectable. 7 pruebas nuevas. Para caber en presupuesto
  se excluyó del tarball `src/icons/icons.json` (fuente de build, no API pública);
  el límite de `check:size` se mantiene.
- Navegador manual: Dialog y Drawer correctos en Chromium local con foco,
  scroll lock, Escape y restauración.
- Paquete: 57 070 / 65 536 bytes comprimidos y 271 802 / 278 528 bytes
  descomprimidos.
- CI GitHub Actions ejecuta `npm run validate`, `npm pack --dry-run` y auditoría
  de dependencias de producción en cada PR y push a `main`.
- F4-001 (review): gate `check:axe` (axe-core + jsdom, sin navegador ni red)
  integrado en `validate` y CI. Ejecuta axe sobre las 7 páginas de `docs/`;
  detectó y se corrigieron 40 nodos (button-name, label, select-name,
  landmark-unique, region, heading-order) en la galería y las plantillas. El
  contraste sigue cubierto por `check:contrast`; estados dinámicos y reglas de
  render quedan para F4-002/003 con navegador. Dev-deps `axe-core`/`jsdom` no
  entran al tarball.
- F4-002 (review): pruebas de navegador con Playwright (Chromium). 14 specs en
  `test/e2e/` verifican foco inicial, `Tab` trap, `Escape`, backdrop, restauración
  del foco y el atajo `Ctrl/Cmd+K` para Dialog, Drawer, Bottom-sheet y Command
  Palette. `test:e2e` corre en un job de CI separado que instala el navegador;
  `validate` sigue siendo el gate rápido sin navegador. Playwright es dev-only.
