# F0-018: `.ro-section`, `.ro-page-header` y utilidades de aspect-ratio

- Estado: review
- Fase: 0 (backlog #15, cierra el ítem — container sizes ya estaba resuelto por F0-012)
- Dependencias: F0-012 (variantes de `.ro-container`, mismo backlog #15)

## Objetivo

Cerrar el resto del backlog #15: `.ro-section` (ritmo vertical), patrón
page-header y utilidad de aspect-ratio. Las variantes de ancho de
`.ro-container` ya se habían resuelto en F0-012.

## Contexto

Las plantillas (`dashboard.html`, `sidebar.html`, `module-3col.html`)
repetían dos patrones sin una clase propia: espaciado vertical entre
secciones vía `style="padding-top:32px;padding-bottom:64px"` en línea, y un
encabezado de página (`eyebrow` + `h1` + acciones/stats) armado cada vez con
`.ro-row.ro-row--between.ro-row--wrap` suelto. `dashboard.html` también usaba
`style="aspect-ratio:16/9"` en línea para el placeholder de video, sin
utilidad reusable para eso ni para proporciones comunes.

## Alcance

- Incluido:
  - `src/layouts/shell.css`: `.ro-section` (`padding-block: var(--ro-space-8)`,
    `2.5rem` en `≥1024px`) y `.ro-section--sm` (`var(--ro-space-6)`/`2rem`);
    `.ro-page-header` (flex, `justify-content: space-between`,
    `align-items: flex-end`, wrap) y `.ro-page-header__actions`.
  - `src/utilities/helpers.css`: `.ro-aspect-video` (16/9),
    `.ro-aspect-square` (1/1), `.ro-aspect` (usa `--ro-aspect` con default
    `16/9` definido en la propia regla — mismo patrón que
    `--ro-table-scroll-max` en F0-017, para no repetir el falso positivo de
    baseline con una custom property sin definir).
  - `docs/layouts.html`: nueva sección "Section, Page-header & Aspect-ratio"
    con demo de las tres piezas.
- Excluido: migrar las plantillas existentes para usar `.ro-section`/
  `.ro-page-header` en vez de sus estilos en línea actuales — no se pidió y
  cambiaría markup ya publicado; queda como candidato futuro.

## Errores encontrados y corregidos durante la verificación

- **Digest de `check:literals`**: los dos `@media (min-width: 1024px)` nuevos
  de `.ro-section`/`.ro-section--sm` suman 2 ocurrencias de `1024px` (valor ya
  usado y aceptado como breakpoint en `.ro-container`, misma categoría de
  excepción que `768px` en F0-012). Digest actualizado (384→386).
- **Demo de aspect-ratio con proporción incorrecta**: los primeros ejemplos
  reusaban `.dx-box` (que trae `padding: 16px` fijo); con `box-sizing:
  border-box` el padding se resta del alto calculado por `aspect-ratio`,
  dando un ratio medido de 1.62/1.26 en vez de 1.78/1.33 (16/9 y 4/3
  exactos). Corregido quitando el padding en línea (`padding:0`) — la clase
  de la librería (`aspect-ratio: 16/9`) siempre fue correcta; el error era
  solo del markup de la demo.
- **Demo de `.ro-section` sin efecto visible**: mismo problema de fondo que el
  doble-outline de F0-016 — `.dx-box`'s `padding: 16px` vive en un `<style>`
  sin `@layer` dentro de `layouts.html`, así que le gana incondicionalmente a
  `.ro-section`'s `padding-block` (capa `roui.layouts`), sin importar
  especificidad. Con `.dx-box`, `padding-top` medía `16px` para **ambas**
  variantes (ni `.ro-section` ni `--sm` se veían). Corregido reemplazando la
  demo por el mismo lenguaje visual que ya usa Container
  (`.dx-bleed` + borde punteado, ahora en `border-block` en vez de
  `border-inline`), sin `.dx-box` de por medio.

## Verificación

- `getBoundingClientRect` tras el fix: `.ro-aspect-video` → 1.78 (16/9
  exacto), `.ro-aspect-square` → 1.00, `.ro-aspect` (`--ro-aspect:4/3`) →
  1.33 (4/3 exacto).
- `getComputedStyle`: `.ro-section` → `padding-top: 32px` (2rem);
  `.ro-section--sm` → `24px` (1.5rem) — ambos distintos y correctos.
- `npm run check:axe`: `docs/layouts.html` sin violaciones; 68/68 en general.
- `npm run validate`: correcto, 0 fallos.
- Presupuesto de paquete: 61005/65536 bytes comprimidos, 282751/294912
  bytes descomprimidos (~12.16 KiB de margen tras el límite subido en
  F0-017).

## Cierre

- Resultado: backlog #15 cerrado por completo (container sizes + section +
  page-header + aspect-ratio).
- Archivos: `src/layouts/shell.css`, `src/utilities/helpers.css`,
  `docs/layouts.html`, `scripts/check-literals.mjs` (digest).
- Comandos: `npm run build`, `npm run check:literals`, `npm run check:axe`,
  `npm run validate`.
