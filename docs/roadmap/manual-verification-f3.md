# Verificación manual — cierre de Fase 3

Las primitivas de Fase 3 pasan los gates automáticos (`npm run validate`, 30
pruebas verdes), pero declarar una primitiva `verified` exige una pasada manual de
teclado y lector de pantalla que el CI headless no cubre. Este documento es el
checklist de esa auditoría.

- Tareas pendientes de verificar: **F3-004**, **F3-005**, **F3-006** (en `review`).
- Ya cerradas: F3-001, F3-002, F3-003 (`done`).

## Preparación

```bash
cd /Users/robertcastro/Robert/dsystem
source ~/.nvm/nvm.sh && nvm use 20   # el build usa esbuild (Node >= 20)
npm run dev                          # compila dist/ y sirve en :8799
```

Páginas:

- Galería: <http://localhost:8799/docs/components.html>
- Plantillas: `/docs/templates/dashboard.html` y `/docs/templates/module-3col.html`

Regla de oro: **navega con teclado** (`Tab`, `Shift+Tab`, flechas, `Enter`,
`Espacio`, `Esc`); no uses el ratón salvo cuando el paso lo pida.

Nota visual: estos contratos **no cambian el diseño**; el estado activo debe verse
igual que antes. Lo nuevo visible es el **anillo de foco** al navegar por teclado
y el respeto a *reducir movimiento*. Si un estado dejó de resaltarse, es un bug de
migración.

## F3-004 · Tabs, Accordion y navegación

- [ ] **Tabs**: `Tab` entra a la lista; `←`/`→` mueven el foco y cambian de panel
      (activación automática); `Home`/`End` van a la primera/última. Solo la
      pestaña activa es tabbable (roving). La activa se resalta como antes.
- [ ] **Accordion**: `Enter`/`Espacio` sobre el encabezado abre/cierra; el chevron
      rota; puede haber más de una sección abierta; **no** se cierra al hacer clic
      fuera ni con `Esc` (persistente).
- [ ] **Navegación**: el enlace actual expone `aria-current="page"` y se resalta;
      el breadcrumb marca su último tramo.
- [ ] Lector de pantalla: la pestaña anuncia «seleccionada»; el encabezado del
      accordion anuncia «contraído/expandido».

## F3-005 · Combobox, Calendar y Command Palette

- [ ] **Combobox**: al escribir se filtra la lista; `↓`/`↑` recorren opciones
      (resaltado por `aria-activedescendant`); `Enter` selecciona; `Esc` cierra.
      El foco **no** abandona el input.
- [ ] **Calendar**: con foco en un día, las flechas mueven por día y por semana;
      `Home`/`End` por semana; `Enter`/`Espacio` selecciona y el día queda
      resaltado (`aria-selected`).
- [ ] **Command Palette**: el botón o `⌘K`/`Ctrl+K` abre un `role="dialog"` modal;
      el foco queda **atrapado** dentro; `Esc` cierra y **el foco vuelve** al
      disparador.
- [ ] Lector de pantalla: el combobox anuncia opción activa y recuento; el diálogo
      se anuncia como modal.

## F3-006 · Toast / notificaciones

- [ ] Los botones de demo lanzan un toast que **se cierra solo** (~5 s) sin mover
      el foco de la página.
- [ ] Al pasar el puntero por encima el cierre automático **se pausa**; al salir se
      reanuda.
- [ ] `Tab` alcanza la **✕** con **anillo de foco** visible; `Enter`/`Espacio` la
      cierra.
- [ ] Lector de pantalla: el toast de **error** interrumpe (`role="alert"`);
      éxito/info se anuncian sin interrumpir (`role="status"`).

## axe (chequeo rápido)

Con la extensión *axe DevTools* en el navegador, escanea `components.html` y las
plantillas. Objetivo: **0 violations** de roles, nombres accesibles y contraste.
La matriz formal (axe automatizado + navegadores + regresión visual) llega en
Fase 4; esto es una verificación puntual.

## Condiciones de salida de Fase 3

Marcar solo cuando todo lo anterior esté verde:

- [ ] Cada primitiva estable define roles, teclado, foco y estados.
- [ ] Los patrones complejos tienen controladores verificables (hecho: overlay,
      disclosure, tabs, combobox, grid, toast).
- [ ] Pruebas de comportamiento verdes (`npm run validate` → 30/30).
- [ ] Auditoría humana aprueba el cierre (esta verificación).

Al aprobar: cambiar el estado de F3-004/005/006 a `verified` en sus fichas y en
`docs/roadmap/progress.md`, y marcar la Fase 3 como `done` en `current-phase.md`.
Si algo falla, anotar el componente y el paso exacto para corregir antes de
`verified`.
