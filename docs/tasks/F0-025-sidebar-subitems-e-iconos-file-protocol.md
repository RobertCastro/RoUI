# F0-025: Subitems en sidebar.html + iconos que funcionan abiertos con doble clic (file://)

- Estado: review
- Fase: 0 (pedido directo del usuario)
- Dependencias: ninguna directa; toca el mismo mecanismo de sprite de iconos
  usado por `dashboard.html`/`module-3col.html`/`sidebar.html` desde F0-013/F0-014.

## Objetivo

El usuario reportó tres problemas sobre `docs/templates/sidebar.html`:

1. El icono de notificación no se ve.
2. Los iconos de cada item del menú del sidebar no se ven.
3. Falta la posibilidad de que algún item del menú tenga subitems.

## Investigación de los iconos (#1 y #2)

Antes de tocar código se sirvió la plantilla por HTTP local y se midió en vivo
(`getComputedStyle`, captura a escala nativa sin zoom): el sprite se inyectaba
bien (55 símbolos), cada `<use href="#ro-i-...">` resolvía al símbolo
correcto, y color/stroke/tamaño eran los esperados — sin bug de CSS ni de
markup. Se confirmó con el usuario que el archivo se estaba abriendo con
doble clic (`file://...`), no vía servidor.

**Causa raíz confirmada**: las 3 plantillas standalone (`dashboard.html`,
`module-3col.html`, `sidebar.html`) inyectaban el sprite de iconos así:

```html
<script>
  fetch(new URL("../../dist/icons.svg", document.baseURI).href)
    .then((r) => (r.ok ? r.text() : ""))
    .then((svg) => {
      if (!svg) return; /* ...insertBefore... */
    });
</script>
```

`fetch()` a un recurso `file://` es bloqueado por CORS en los navegadores —
la promesa nunca resuelve con el SVG, el sprite nunca se inyecta, y **todos**
los `<use href="#ro-i-...">` de la página quedan sin símbolo que resolver
(bell y los del menú a la vez), exactamente los dos síntomas reportados.

## Fix aplicado (a las 3 plantillas, alcance confirmado con el usuario)

Se reemplazó la inyección por `fetch()` por un sprite **inline estático**:
un `<svg aria-hidden="true" style="display:none">` con solo los `<symbol>`
que cada plantilla realmente usa (copiados de `dist/icons.svg`, la fuente
real), colocado como primer hijo de `<body>`. Al ser parte del documento
desde el parseo inicial, no depende de red ni de JS — funciona igual servido
por HTTP que abierto directamente con doble clic.

- `dashboard.html`: 10 símbolos (bell, building-2, check, chevron-down,
  external-link, languages, menu, plus, wrench, x).
- `module-3col.html`: 12 símbolos (agrega book-open, chevron-left/right,
  share-2 sobre el set de dashboard, sin languages/plus).
- `sidebar.html`: 9 símbolos (bell, building-2, calendar, chevron-down, menu,
  search, settings, user, x).

Se dejó un comentario en cada plantilla explicando el porqué (no es
redundante: documenta un requisito no obvio) y recordando que un ícono nuevo
usado en esa página necesita agregar su `<symbol>` ahí también — no hay
mecanismo automático que lo mantenga sincronizado.

Se eliminó el `<script>` de `fetch()` de las 3 plantillas (ya no hace falta).

## Subitems en el menú (#3)

Se reutilizó `disclosure-controller` — el mismo primitivo detrás de
Accordion — en vez de inventar un mecanismo nuevo. "Equipos" pasó de ser un
`<a class="ro-nav-item">` plano a:

- Un `<button class="ro-nav-item ro-nav-item--parent" data-ro-disclosure-trigger aria-expanded aria-controls>`
  con un chevron (`ro-i-chevron-down` + nueva clase `.ro-nav-item__chevron`
  que rota 180° cuando `aria-expanded="true"`).
- Un panel `<div class="ro-nav-item__sub" data-ro-disclosure-panel>` con dos
  subitems indentados (`.ro-nav-item--sub`): "Frontend" y "Diseño".
- El contenedor con `data-ro-disclosure-root data-ro-disclosure-persistent`
  — persistente porque es navegación, no debe cerrarse con Escape ni clic
  afuera (a diferencia de Menu/Popover).

Aplicado en las dos copias del menú (drawer móvil y rail de escritorio, con
ids únicos `equipos-panel-drawer`/`equipos-panel-rail`), y cableado con un
`<script type="module">` nuevo que importa `createDisclosureController` e
inicializa cada `[data-ro-disclosure-root]`, igual patrón que el ya usado
para overlay-controller.

CSS nuevo en `src/components/sidebar.css`: `.ro-nav-item__chevron`,
`.ro-nav-item--parent[aria-expanded="true"] .ro-nav-item__chevron`,
`.ro-nav-item__sub` (indentación, visibilidad gobernada por `[hidden]` del
disclosure-controller igual que `.ro-accordion__panel`), `.ro-nav-item--sub`.

## Verificación

- Servido por HTTP local: `getComputedStyle` confirma sprite inline (9
  símbolos en sidebar, sin fetch), iconos con stroke/color/tamaño correctos,
  captura a escala nativa muestra bell + los 4 iconos del rail + los 2
  subitems nítidos.
- Toggle del disclosure probado programáticamente
  (`trigger.click()` real, vía el listener que instala el controller):
  `aria-expanded` y `hidden` alternan correctamente entre abrir/cerrar.
- `npm run check:axe` y `npm run validate`: 0 fallos, presupuesto sin
  cambios (`docs/` no se empaqueta).

## Cierre

- Resultado: las 3 plantillas standalone ya no dependen de `fetch()` para
  sus iconos — funcionan igual abiertas con doble clic que servidas por
  HTTP. `sidebar.html` gana un patrón real de subitems reutilizando
  disclosure-controller, sin inventar un primitivo nuevo.
- Archivos: `docs/templates/{dashboard,module-3col,sidebar}.html`,
  `src/components/sidebar.css`.
- Comandos: `npm run build`, `npm run check:axe`, `npm run validate`.
