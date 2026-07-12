# F3-003: Contratos accesibles de Menu, Popover y Tooltip

- Estado: review
- Fase: 3
- Dependencias: F3-002
- ADR relacionados: ADR-0002, ADR-0005

## Objetivo

Convertir los patrones flotantes existentes en contratos accesibles: Menu con
teclado completo, Popover no modal con cierre predecible y Tooltip semántico
anunciado mediante `aria-describedby`.

## Contexto

La galería mantenía toggles exclusivos de demo. Los menús no tenían roles ni
navegación por flechas, y el texto de los tooltips vivía en un pseudo-elemento
que las tecnologías de asistencia no podían asociar al disparador.

## Alcance

- Incluido: controlador ESM de disclosure, contrato de marcado, navegación de
  menú, ejemplos públicos, tooltip semántico, tests y export del paquete.
- Incluido: evitar duplicar fuentes de primitivas JavaScript dentro del tarball.
- Excluido: submenús, posicionamiento con colisiones, portal automático,
  contenido interactivo dentro de Tooltip y matriz browser/axe de Fase 4.
- Cambio incompatible documentado: se retira el patrón visual
  `.ro-tooltip[data-tooltip]` porque no expone una descripción accesible. No
  hay consumidores estables; los ejemplos migran al contrato con
  `aria-describedby` y `role="tooltip"`.

## Criterios de aceptación

- [x] Menu define `menu`/`menuitem`, nombre, `aria-expanded` y teclado
  Arrow, Home, End, Escape y Tab.
- [x] Popover declara su relación con el disparador y cierra por Escape o
  interacción exterior sin comportarse como un modal.
- [x] Tooltip usa un elemento con `role="tooltip"` asociado por
  `aria-describedby`; no contiene controles interactivos.
- [x] El controlador público se empaqueta, se usa en las demos y tiene pruebas
  de teclado, selección y cierre exterior.
- [x] El paquete conserva sus presupuestos sin publicar fuentes duplicadas.

## Plan de validación

```bash
npm run test:primitives
npm run test:package
npm run validate
git diff --check
```

## Cierre

- Resultado: controlador ESM de disclosure, contratos de marcado para Menu y
  Popover, y Tooltip semántico asociado a sus disparadores.
- Archivos modificados: controlador y tests de primitivas, build/export del
  paquete, estilos, demos, README y documentación de accesibilidad.
- Comandos ejecutados: `npm run validate`, `git diff --check`; ambos correctos.
- Evidencia manual: Chromium local, `http://localhost:8799/docs/components.html`;
  Arrow recorre Menu, Escape restaura el trigger, Popover cierra al clicar fuera
  y Tooltip expone `role="tooltip"` mediante `aria-describedby`.
- Decisión de paquete: las fuentes de `src/primitives` ya no se publican junto
  al ESM minificado de `dist/primitives`; el tarball mide 270 118 bytes sin
  cambiar el presupuesto vigente.
- Migración: sustituir `.ro-tooltip[data-tooltip]` por
  `.ro-tooltip-trigger` + un elemento `.ro-tooltip[role="tooltip"]` asociado
  al control con `aria-describedby`.
- Riesgos pendientes: submenús, colisiones, axe y regresión visual se cubren en tareas posteriores y Fase 4.
- Siguiente tarea desbloqueada: F3-004 Tabs, Accordion y navegación.
