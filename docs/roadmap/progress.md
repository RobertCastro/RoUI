# Estado del programa

Ultima actualizacion: 2026-07-12

## Fases

| Fase | Estado | Progreso | Condicion siguiente |
|---|---|---:|---|
| 0. Sistema de ejecucion | done | 100% | Cerrada y aprobada |
| 1. Fundamentos | done | 100% | Cerrada y aprobada |
| 2. Tokens y temas | done | 100% | Cerrada y aprobada |
| 3. Primitivas accesibles | in-progress | 60% | Completar F3-004: Tabs, Accordion y navegación |
| 4. Pruebas integrales | backlog | 0% | Se inicia parcialmente desde Fase 1 |
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
- Primitivas: tres pruebas Node cubren foco inicial, `Tab`/`Shift+Tab`,
  `Escape`, cierre y restauración del disparador.
- Navegador manual: Dialog y Drawer correctos en Chromium local con foco,
  scroll lock, Escape y restauración.
- Paquete: 57 070 / 65 536 bytes comprimidos y 271 802 / 278 528 bytes
  descomprimidos.
- CI GitHub Actions ejecuta `npm run validate`, `npm pack --dry-run` y auditoría
  de dependencias de producción en cada PR y push a `main`.
