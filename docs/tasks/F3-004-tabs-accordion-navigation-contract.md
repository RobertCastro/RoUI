# F3-004: Contratos accesibles de Tabs, Accordion y navegación

- Estado: done
- Fase: 3
- Dependencias: F3-003
- ADR relacionados: ADR-0002, ADR-0005

## Objetivo

Convertir Tabs, Accordion y la navegación de la galería en contratos accesibles:
Tabs con patrón `tablist`/`tab`/`tabpanel` y roving tabindex, Accordion con
disclosure semántico por región, y navegación con landmark y `aria-current`.

## Contexto

La galería usaba toggles de demostración: los tabs cambiaban una clase
`.ro-tab--active` sin roles ARIA ni teclado; el accordion alternaba `.is-open`
sin `aria-expanded` ni región asociada; la navegación no exponía landmark ni
página actual. F3-003 dejó desbloqueada esta tarea.

## Alcance

- Incluido: controlador ESM `tabs-controller` (roving tabindex, flechas, Home,
  End, activación automática/manual), contrato de marcado para Tabs, Accordion
  (reutiliza `disclosure-controller`) y navegación, migración de demos y
  plantillas, tests de teclado y export del paquete.
- Excluido: tabs con carga diferida, submenús, orientación con colisiones,
  reordenamiento por drag, y la matriz browser/axe/visual de Fase 4.
- Cambio incompatible documentado: se retira el patrón de demo
  `.ro-tab--active` + `data-tabs`/`data-tab-panels` y el `.is-open` manual del
  accordion. No hay consumidores estables; el marcado migra al contrato ARIA.

## Criterios de aceptación

- [x] Tabs declara `role=tablist/tab/tabpanel`, `aria-selected`, `aria-controls`
  y `aria-labelledby`; solo la pestaña activa es tabbable (roving tabindex).
- [x] Teclado de Tabs: Flecha (según orientación), `Home`, `End` mueven; la
  activación automática selecciona al enfocar y el panel inactivo queda `hidden`.
- [x] Accordion usa `button` con `aria-expanded`/`aria-controls` dentro de un
  encabezado y región `role=region` etiquetada; abre y cierra por teclado.
- [x] La navegación de ejemplo expone `nav` con nombre y `aria-current="page"`.
- [x] El controlador `tabs-controller` se empaqueta, se usa en las demos y tiene
  pruebas de foco inicial, roving, flechas, `Home`/`End` y activación.
- [x] `npm run validate` y `git diff --check` quedan verdes sin romper el
  presupuesto del paquete.

## Plan de validación

```bash
npm run test:primitives
npm run test:package
npm run validate
git diff --check
```

## Cierre

- Resultado: primitiva ESM `tabs-controller` (roving tabindex, flechas, Home,
  End, activación automática/manual), contratos de marcado para Tabs, Accordion
  (disclosure persistente) y navegación, y migración de galería y plantillas.
- Archivos modificados: `src/primitives/tabs-controller.js`,
  `src/primitives/disclosure-controller.js` (opción persistente),
  `test/tabs-controller.test.mjs`, `test/disclosure-controller.test.mjs`,
  `package.json` (export), `src/components/nav.css`,
  `src/components/accordion.css`, `docs/components.html`,
  `docs/templates/dashboard.html`, `docs/templates/module-3col.html`,
  `docs/assets/docs.js`, `docs/accessibility/tabs-accordion-navigation.md`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run build`, `npm run validate` y `git diff --check`,
  todos correctos (12 pruebas de primitivas, tarball, fixtures y presupuesto).
- Cambio incompatible: se retiró `.ro-tab--active`, `.ro-nav-link--active`,
  `data-tabs`/`data-tab-panels` y el `.is-open` manual del accordion; verificado
  con `grep` que no queda ninguna referencia.
- Riesgos pendientes: falta verificación manual de navegador y axe (teclado real
  y lector de pantalla) antes de pasar a `verified`; la matriz automatizada de
  navegador/axe/visual llega en Fase 4.
- Siguiente tarea desbloqueada: F3-005 Combobox, Calendar y Command Palette.
