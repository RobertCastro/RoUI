# F0-015: Drawer de navegación móvil en las 3 plantillas standalone

- Estado: review
- Fase: 0 (bug funcional, detectado en revisión del usuario sobre `docs/layouts.html`)
- Dependencias: F0-012 (origen de `sidebar.html` y `.ro-layout-rail`), F0-014
  (bug relacionado de reset.css, mismo conjunto de archivos)

## Objetivo

Corregir un bug funcional real (no solo documental): en las 3 plantillas
standalone, `.ro-burger` se renderizaba visible por debajo de 768px pero sin
ningún comportamiento asociado — ni `data-ro-overlay-open`, ni drawer, ni
listener. Por debajo de ese breakpoint, `.ro-header__nav` (nav principal) y,
en `sidebar.html`/`module-3col.html`, también `.ro-rail--left` (rail lateral)
tienen `display: none` — así que en móvil no había ninguna forma de navegar:
ni el sitio, ni (en las plantillas con rail) las categorías o el temario del
curso.

## Diagnóstico

El usuario revisó `docs/layouts.html` y las plantillas y señaló: "el botón
`.ro-burger` no implementa apertura del sidebar en móvil… un consumidor podría
copiar una navegación aparentemente funcional que en móvil no abre nada."

Se verificó contra el código real:

- `src/components/header.css`: `.ro-burger { display: grid; }` y
  `.ro-header__nav { display: none; }` por defecto, ambos invertidos a
  `≥768px`. El botón es visible exactamente en el rango donde la nav
  principal está oculta.
- `src/layouts/three-col.css`: `.ro-rail { display: none; }` por defecto,
  `.ro-rail--left { display: flex; }` solo a partir de `≥768px`. En
  `sidebar.html` y `module-3col.html`, el rail izquierdo desaparece por
  completo en móvil.
- `grep -rn "drawer-controller" src/ docs/`: sin resultados — no existe un
  "drawer-controller" separado; Drawer se implementa sobre `overlay-controller`
  (mismo contrato que Modal: `data-ro-overlay-root`, `data-ro-overlay-open`,
  `data-ro-overlay-close`, `data-ro-overlay-backdrop`), confirmado en
  `docs/reference/components/drawer.json` y en el propio wiring de
  `docs/assets/docs.js` (líneas 62-72).
- `grep -n "ro-burger" docs/assets/*.js src/`: sin coincidencias — confirmado
  que el botón nunca tuvo comportamiento en ningún lugar del repo, tampoco en
  el sitio de docs.

## Alcance

- Incluido: en las 3 plantillas, conectar `.ro-burger` a un drawer real vía
  `overlay-controller` (`data-ro-overlay-open="mobile-nav"` +
  `aria-haspopup="dialog"` `aria-controls="mobile-nav"` `aria-expanded="false"`
  en el botón; nuevo `<div class="ro-drawer-root" id="mobile-nav" ...>` con
  `ro-drawer ro-drawer--left`, backdrop y botón de cierre; script de wiring
  inline — mismo patrón de `docs.js` — que importa `createOverlayController`
  desde `dist/primitives/overlay-controller.js`). Contenido del drawer:
  - `dashboard.html`: nav principal (no tiene rail).
  - `sidebar.html`: nav principal + nav de "Categorías" (el rail completo).
  - `module-3col.html`: nav principal + nav de "Clases del curso" (rail
    izquierdo). El rail derecho ("Recursos") queda fuera: es progressive
    disclosure desde `1280px` por diseño previo, no un caso de contenido
    inalcanzable en móvil.
- Excluido: rail derecho de `module-3col.html`; documentar el patrón en
  `docs/layouts.html` (el rail y su breakpoint de `768px` siguen sin
  mencionarse ahí — pendiente, ver "Siguiente" más abajo).

## Verificación

- Las 3 plantillas, en viewport móvil (375×812): el burger abre el drawer
  (`root.hidden === false`, `classList.contains('is-open')`); `Escape` lo
  cierra y devuelve el foco al burger (`document.activeElement === burger`,
  `aria-expanded` vuelve a `"false"`).
- Capturas visuales: `sidebar.html` muestra nav principal + Categorías;
  `dashboard.html` muestra nav principal; `module-3col.html` muestra nav
  principal + Clases del curso (con el módulo activo resaltado, igual que en
  el rail de escritorio).
- `npm run check:axe`: 68/68 páginas sin violaciones (el `role="dialog"` +
  `aria-modal` + trap de foco los aporta `overlay-controller`, mismo contrato
  ya validado en Modal/Drawer de referencia).
- `npm run validate`: correcto, 0 fallos, presupuesto sin cambios
  (277472/278528 — el drawer reutiliza `overlay-controller.js` y
  `drawer.css`, ambos ya distribuidos).

## Siguiente

Resuelto en un cambio posterior de esta misma tarea: el usuario marcó esto
como la prioridad más importante ("dejar claro que `.ro-layout-rail` oculta
el rail en móvil y necesita un Drawer"). Se agregó a `docs/layouts.html`,
sección "App shell con rail", un bloque "Comportamiento en móvil (obligatorio,
no opcional)" que aclara explícitamente que `<md: 1 columna` significa que el
rail **desaparece** (no se apila), que `.ro-header__nav` también se oculta en
ese rango, y que la alternativa obligatoria es el drawer implementado en
F0-015 (no opcional — "un burger sin drawer es un botón que no hace nada").
Enlaza al contrato `accessibility/dialog-drawer.html`. Verificado con
`npm run check:axe` (0 violaciones en `docs/layouts.html`) y
`npm run validate` (0 fallos, presupuesto sin cambios ya que `docs/` no forma
parte del paquete publicado).

## Cierre

- Resultado: las 3 plantillas son ahora funcionalmente completas en móvil, no
  solo visualmente — el burger abre navegación real, no un botón inerte.
- Archivos: `docs/templates/{dashboard,module-3col,sidebar}.html`.
- Comandos: `npm run check:axe`, `npm run validate`.
