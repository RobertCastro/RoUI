# F0-014: `reset.css` faltante en las 3 plantillas standalone

- Estado: review
- Fase: 0 (bug de consistencia visual, reportado por el usuario tras F0-013)
- Dependencias: F0-013 (bug relacionado pero de causa distinta)

## Objetivo

Corregir un segundo bug real, más severo que F0-013: las 3 plantillas
standalone nunca cargaban `reset.css`, por lo que `.ro-root` nunca recibía
`font-family: var(--ro-font-sans)` ni el resto del reset (`box-sizing`,
`:focus-visible`, `prefers-reduced-motion`).

## Diagnóstico

Tras aplicar F0-013 (pesos tipográficos), el usuario reportó que persistían
partes sin la fuente correcta, con una captura de `sidebar.html` mostrando los
nombres del listado ("María Alonso", "Robert Castro", "Julián Pérez") en una
tipografía serif.

Se verificó en navegador con `getComputedStyle('.ro-root').fontFamily`, que
devolvía `Times` (la fuente por defecto del navegador) pese a que
`--ro-font-sans` sí resolvía correctamente a `"Inter", ui-sans-serif,
system-ui, sans-serif` como custom property. Se inspeccionó directamente el
CSSOM de `dist/roui.css` cargado (`document.styleSheets` → `cssRules`) y se
confirmó que la capa `@layer roui.reset` está declarada en
`@layer roui.tokens, roui.reset, roui.base, ...` pero no tiene ningún bloque
de reglas asociado — de las 62 reglas de nivel superior del stylesheet, cero
pertenecen a `roui.reset`.

Causa raíz en `src/index.css` (decisión de arquitectura deliberada, documentada
en su propio comentario: "RoUI agregado sin reset global. Importa reset.css de
forma explícita."): `src/base/reset.css` nunca se importa al bundle; solo
`src/base/animations.css` se importa en la capa `roui.base`. Esto es correcto
para el paquete publicado — `docs/reference/getting-started.md` ya instruye
correctamente a los consumidores reales a importar
`@robertcastro/roui/reset.css` por separado (línea 22).

El bug real es que las 3 plantillas standalone del propio sitio de docs nunca
siguieron esa misma guía. Se confirmó con
`grep -rln "reset.css" docs/*.html docs/templates/*.html scripts/build-reference.mjs`:
cero coincidencias en todo el sitio.

Alcance del impacto: limitado a exactamente estas 3 páginas. El resto del
sitio (`docs/index.html`, `tokens.html`, `components.html`, `layouts.html`,
`icons.html`, las 49 páginas de referencia generadas y las 6 páginas de
contratos de accesibilidad) cargan además `docs/assets/docs.css`, que declara
su propia regla `body { font-family: var(--ro-font-sans, ...) }` — esto
enmascaraba el problema de fuente en esas páginas, pero no el resto de reglas
de `reset.css` (`box-sizing`, `:focus-visible`, `prefers-reduced-motion`), que
tampoco se verificó si estaban cubiertas allí por otra vía.

## Alcance

- Incluido: agregar `<link rel="stylesheet" href="../../src/base/reset.css">`
  en el `<head>` de las 3 plantillas afectadas, antes del link a
  `dist/roui.css` (el orden no afecta la cascada real — `reset.css` no está
  envuelto en `@layer`, así que sus reglas siempre ganan sobre las reglas en
  capas de `roui.css` sin importar el orden — pero se mantiene ese orden por
  claridad, replicando cómo lo haría un consumidor nuevo siguiendo
  `getting-started.md`).
- Excluido: revisar si `docs/assets/docs.css` cubre de forma redundante el
  resto de reglas de `reset.css` en las demás páginas del sitio (no reportado
  por el usuario, no verificado en este fix).

## Verificación

- `getComputedStyle(document.querySelector('.ro-root')).fontFamily` en
  `sidebar.html`: `"Times"` → `"Inter, ui-sans-serif, system-ui, sans-serif"`.
- `getComputedStyle(document.querySelector('.ro-list__item')).boxSizing`:
  confirmado `border-box` tras el fix.
- Captura visual: los 3 nombres del listado de Directorio renderizan en Inter
  sans-serif, consistente con el resto del sitio.
- `npm run check:axe`: 68/68 páginas sin violaciones.
- `npm run validate`: correcto, 0 fallos, presupuesto de paquete sin cambios
  (277472/278528 — `src/base/reset.css` ya se distribuía como archivo fuente,
  esta plantilla solo lo referencia vía `<link>`, no agrega contenido nuevo al
  paquete).

## Cierre

- Resultado: las 3 plantillas standalone ahora siguen la misma guía de
  importación explícita de reset que se documenta para consumidores reales del
  paquete.
- Archivos: `docs/templates/{dashboard,module-3col,sidebar}.html`.
- Comandos: `npm run check:axe`, `npm run validate`.
