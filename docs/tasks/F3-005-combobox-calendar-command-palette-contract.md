# F3-005: Contratos accesibles de Combobox, Calendar y Command Palette

- Estado: in-progress
- Fase: 3
- Dependencias: F3-004
- ADR relacionados: ADR-0002, ADR-0005

## Objetivo

Dar comportamiento accesible a Combobox, Calendar/Date Picker y Command Palette:
listbox emergente con `aria-activedescendant`, cuadrícula de calendario navegable
por teclado y paleta de comandos como combobox dentro de un diálogo modal.

## Contexto

Las demos usaban lógica ad-hoc: el combobox filtraba con una clase `is-open` sin
roles ARIA; el calendario cambiaba `--selected` sin semántica de cuadrícula ni
teclado; la paleta abría un overlay propio sin `role=dialog` ni `role=listbox`.

## Alcance

- Incluido: primitiva `combobox-controller` (listbox, activedescendant, filtrado,
  teclado) reutilizable por Combobox y Command Palette; primitiva de cuadrícula
  para Calendar (roving por día, flechas, `Home`/`End`, `PageUp`/`PageDown`);
  Command Palette como combobox dentro de `overlay-controller` (diálogo modal);
  migración de las tres demos, contrato, tests y exports.
- Excluido: rangos de fechas, multi-selección, carga remota y la matriz
  browser/axe/visual de Fase 4.
- Cambio incompatible: se retira el patrón de demo de combobox (`is-open`),
  del calendario (`--selected` por clic) y de la paleta (overlay propio).

## Progreso

- [x] `combobox-controller` publicado, con pruebas de teclado, filtrado y cierre.
- [x] Combobox migrado a `role=combobox`/`role=listbox`/`role=option` con
  `aria-activedescendant`.
- [ ] Command Palette como combobox dentro de `role=dialog` modal.
- [ ] Calendar con `role=grid` y navegación por teclado.

## Criterios de aceptación

- [ ] Combobox: listbox con opciones `role=option`, `aria-expanded`,
  `aria-controls`, `aria-activedescendant`; flechas, `Home`/`End`, `Enter`,
  `Escape` y filtrado sin mover el foco del input.
- [ ] Command Palette: `role=dialog` modal con foco atrapado, combobox interno y
  cierre con `Escape`.
- [ ] Calendar: `role=grid`, celdas navegables por teclado y día seleccionado con
  `aria-selected`.
- [ ] Controladores empaquetados, usados en las demos y con pruebas.
- [ ] `npm run validate` y `git diff --check` verdes dentro del presupuesto.

## Plan de validación

```bash
npm run test:primitives
npm run validate
git diff --check
```

## Cierre

- Resultado:
- Archivos modificados:
- Comandos ejecutados:
- Riesgos pendientes:
- Siguiente tarea desbloqueada:
