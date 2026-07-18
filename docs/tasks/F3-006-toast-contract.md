# F3-006: Contrato accesible de Toast / notificaciones

- Estado: review
- Fase: 3
- Dependencias: F3-002 (overlay), F3-005
- ADR relacionados: ADR-0002, ADR-0005

## Objetivo

Dar comportamiento accesible a las notificaciones flotantes (toasts): anuncio por
regiones vivas (`role=status`/`role=alert`), cierre automático con pausa al
interactuar y botón de cierre, sin trasladar el foco al toast.

## Contexto

La demo generaba los toasts con lógica ad-hoc en `docs.js`: creaba `.ro-toast`
sin `role` ni región viva, con un `setTimeout` fijo y sin pausa al pasar el
puntero. Los mensajes no se anunciaban de forma fiable en lectores de pantalla.

## Alcance

- Incluido: primitiva `toast-controller` (regiones vivas por variante, cierre
  automático configurable, pausa en `pointer`/`focus`, botón de cierre,
  `prefers-reduced-motion`, icono inyectable); migración de la demo, CSS de foco
  y movimiento reducido, contrato, tests y export.
- Excluido: colas con límite máximo, posicionamiento por colisiones, acciones
  dentro del toast y la matriz browser/axe/visual de Fase 4.
- Cambio incompatible: se retira el patrón de demo de toast (`.ro-toast` sin role
  con `setTimeout` fijo).

## Presupuesto

La primitiva nueva superaba el margen descomprimido (quedaban ~1 KB). Se recupera
espacio excluyendo del tarball `src/icons/icons.json` (7,6 KB), que es fuente de
build para `dist/icons.svg` y **no** forma parte de la API pública (solo lo leen
`scripts/build.mjs` y `scripts/baseline.mjs` desde el repo). El límite de
presupuesto de `check:size` se mantiene sin cambios (no requiere ADR).

## Progreso

- [x] `toast-controller` publicado, con pruebas de anuncio, cierre y pausa.
- [x] Cada toast se inserta con `role=status` (éxito/info) o `role=alert` (error).
- [x] Cierre automático configurable con pausa en `pointer`/`focus` y botón de
  cierre con `aria-label` y anillo de foco.
- [x] Demo (`docs.js`) migrada a la primitiva; icono inyectado desde el sprite.
- [x] `src/icons/icons.json` excluido del tarball para respetar el presupuesto.

## Criterios de aceptación

- [x] Toast: `role=status` para éxito/info y `role=alert` para errores; sin robar
  el foco.
- [x] Cierre automático por defecto (5000 ms), `duration: 0` persistente, y pausa
  al pasar el puntero o enfocar.
- [x] Botón de cierre con `aria-label`, foco visible y `dismissAll()`/`dismiss()`.
- [x] Controlador empaquetado, usado en la demo y con pruebas.
- [x] `npm run validate` y `git diff --check` verdes dentro del presupuesto.

## Plan de validación

```bash
npm run test:primitives
npm run validate
git diff --check
```

## Cierre

- Resultado: primitiva ESM accesible `toast-controller` que anuncia por regiones
  vivas (`role=status`/`role=alert`), cierra automáticamente con pausa al
  interactuar y expone `success`/`error`/`info`, `dismiss()` y `dismissAll()`.
- Archivos modificados: `src/primitives/toast-controller.js`,
  `test/toast-controller.test.mjs`, `package.json` (export + exclusión de
  `src/icons/icons.json` del tarball), `src/components/toast.css`,
  `docs/assets/docs.js`, `docs/accessibility/toast.md`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run build`, `npm run validate` y `git diff --check`.
- Cambio incompatible: retirado el patrón de demo de toast con `setTimeout` fijo.
- Riesgos pendientes: verificación manual de navegador y axe antes de `verified`.
- Siguiente tarea desbloqueada: cierre de Fase 3 (auditoría humana) o la que fije
  `current-phase.md`.
