# F0-016: Especificidad de `.ro-nav-item--active:hover`, color del anillo de foco y doble outline de `reset.css`

- Estado: review
- Fase: 0 (bugs reales detectados por el usuario en revisión visual de `sidebar.html`)
- Dependencias: ninguna (el segundo y tercer bug son del bundle publicado, no de las plantillas)

## Objetivo

Corregir dos bugs visuales reales señalados por el usuario con capturas:

1. Al pasar el cursor sobre el ítem de rail activo (`.ro-nav-item--active`), el
   texto se volvía casi ilegible (blanco sobre fondo casi blanco).
2. El campo de búsqueda de `sidebar.html` mostraba un doble anillo de foco de
   dos colores distintos (borde amarillo + resplandor morado).

## Diagnóstico

### 1. `.ro-nav-item--active:hover`

`.ro-nav-item:hover { background: var(--ro-ink-04); }` (dos clases de
especificidad efectiva vía pseudo-clase) tiene **mayor especificidad** que
`.ro-nav-item--active { background: var(--ro-ink); color: var(--ro-white); }`
(una sola clase). Al pasar el cursor sobre el ítem activo, el fondo oscuro de
`--active` se sobrescribía por el fondo casi blanco de `:hover`, pero el color
de texto blanco de `--active` no cambiaba (`:hover` no lo toca) — resultando
en texto blanco sobre fondo claro.

### 2. Anillo de foco de dos colores

Se verificó en vivo (`getComputedStyle` sobre `.ro-field` con el input
enfocado): `border-color: rgb(246, 240, 114)` (amarillo) y
`box-shadow: rgba(169, 160, 236, 0.55)` (morado). Se rastreó la cadena de
tokens:

- `--ro-control-focus-border: var(--ro-accent)` → `--ro-accent` base
  (`colors.css`) = `var(--ro-primary)` = `#f6f072` (amarillo).
- `--ro-focus-ring: 0 0 0 3px rgba(169, 160, 236, 0.55)` (`effects.css`,
  morado — el mismo RGB que `--ro-secondary: #a9a0ec`).

Estos dos tokens nunca fueron diseñados en conjunto: `.ro-field`,
`.ro-field--disclosure`, `.ro-input-box`, `.ro-textarea` y `.ro-select-box`
aplican ambos (`box-shadow: var(--ro-focus-ring)` +
`border-color: var(--ro-control-focus-border)`) y siempre muestran dos tonos.
`.ro-input-group` evitaba el amarillo hardcodeando
`border-color: var(--ro-secondary)`, pero eso tampoco es correcto: bajo
`[data-ro-theme="dark"]` y `[data-ro-theme="high-contrast"]`,
`--ro-focus-ring` cambia de color (amarillo y blanco respectivamente) mientras
`--ro-secondary` nunca lo hace — mismo bug, manifestado distinto.

**Causa raíz más profunda, no específica de estos componentes**: al intentar
agregar overrides de `control-focus-border` por tema en
`tokens/tokens.json`, se comprobó que **no surtían efecto**. Se rastreó a
`src/index.css`: `@import "./tokens/themes.css"` se cargaba **antes** que
`@import "./tokens/components.css"`, ambos en la misma capa (`roui.tokens`).
Con igual especificidad (`:root` vs. `[data-ro-theme="x"]`, ambas 0,1,0 sobre
el mismo elemento `<html>`), gana la declaración que aparece **después** en el
código fuente — y `components.css` siempre iba después de `themes.css`. Esto
significa que **ningún token de tema cuyo valor base viva en `components.css`
podía sobrescribirse jamás**, sin importar qué tema estuviera activo.

Se confirmó que esto ya afectaba a `--ro-button-primary-fg` (también definido
en `components.css`, también con overrides en `dark`/`high-contrast`): el
override nunca aplicaba; lo que se veía en pantalla coincidía por pura
coincidencia con `var(--ro-text)` (un token correctamente temable definido en
`colors.css`, que sí carga antes de `themes.css`), enmascarando el bug. Sin
esa coincidencia — como en `control-focus-border`, cuyo valor base no
depende de ningún otro token temable — el bug queda expuesto directamente.
Este es un bug de arquitectura del paquete publicado, no algo introducido por
las plantillas de este sitio.

### 3. Doble outline de `reset.css` sobre el input (reportado tras el fix inicial)

El usuario señaló que, tras el fix del punto 2, "el borde del input aún
aparece". Se verificó en vivo con foco real (clic, no `.focus()` por script):
el `<input class="ro-input">` mostraba, además del anillo redondeado correcto
de `.ro-field`, un **segundo contorno rectangular** ajustado al propio input.
`getComputedStyle` confirmó `outline: 2px solid rgb(169, 160, 236)` — el
`:focus-visible { outline: 2px solid var(--ro-secondary); outline-offset: 2px; }`
de `reset.css`, aplicándose *encima* de `.ro-input { outline: none }`
(`form.css`, capa `roui.components`).

Causa raíz: `reset.css` se carga como hoja de estilos independiente y **nunca
estuvo envuelto en `@layer`** — es CSS "sin capa". Por regla del spec de CSS
Cascade Layers, cualquier regla sin capa gana siempre sobre cualquier regla en
capas, sin importar la especificidad. Esto significa que el
`outline: none` de **todo** componente interactivo que use su propio anillo
de foco (`.ro-input`, `.ro-btn`, `.ro-avatar`, `.ro-btn-icon`, `.ro-textarea`,
`.ro-select`, `.ro-menu__item`, `.ro-toast__close`, `.ro-slider`,
`.ro-field--disclosure`, `.ro-input-box`, `.ro-select-box` — 12 selectores)
queda roto en cuanto `reset.css` se carga junto al bundle, que es exactamente
el patrón que `getting-started.md` documenta como uso recomendado para
cualquier consumidor real del paquete. No es un bug de plantilla: es un bug
del propio `reset.css` publicado, solo que nunca se había ejercitado en
pruebas automatizadas (ninguna fixture de `test:consumers` importa
`reset.css`).

Fix: envolver todo `reset.css` en `@layer roui.reset { ... }`. `dist/roui.css`
ya declara el orden de capas globalmente
(`@layer roui.tokens, roui.reset, roui.base, roui.layouts, roui.components, roui.utilities;`),
y ese orden aplica a todo el documento sin importar en qué archivo o en qué
orden de `<link>` se declare — así que aunque `reset.css` se cargue como hoja
aparte, sus reglas ahora compiten dentro del sistema de capas y
`roui.components` (declarado después) sigue ganando, exactamente la intención
original del comentario del propio archivo ("los que usan --ro-focus-ring
hacen override").

## Alcance

- Incluido:
  - `src/components/sidebar.css`: agregar
    `.ro-nav-item--active:hover { background: var(--ro-ink); }`.
  - `tokens/tokens.json`: `control-focus-border` base pasa de
    `{colors.accent}` a `{colors.secondary}` (coincide con el tono de
    `--ro-focus-ring` base); se agrega `control-focus-border` explícito a los
    bloques `dark` (`{colors.primary}`, amarillo — coincide con el
    `focus-ring` amarillo de ese tema) y `high-contrast` (`#ffffff` — coincide
    con su `focus-ring` blanco sólido).
  - `src/components/input-group.css`: `border-color: var(--ro-secondary)` →
    `border-color: var(--ro-control-focus-border)` (mismo patrón que el
    resto de controles, ahora correctamente temable).
  - `src/index.css`: se invierte el orden de import de `themes.css` y
    `components.css` (`components.css` ahora carga primero) para que
    cualquier override de tema, presente o futuro, sobre un token base
    definido en `components.css` funcione correctamente.
  - `src/base/reset.css`: todo el contenido se envuelve en
    `@layer roui.reset { ... }` (antes era CSS sin capa). Comentario de
    cabecera recortado para no exceder el presupuesto de paquete.
- Excluido: auditar si existen otros tokens con el mismo problema de
  enmascaramiento por coincidencia (fuera de `button-primary-fg`, ya
  verificado como corregido por este mismo fix de orden de import).

## Verificación

- `.ro-nav-item--active`, hover simulado (`dispatchEvent(mouseover)`):
  `backgroundColor: rgb(23, 23, 25)`, `color: rgb(255, 255, 255)` — contraste
  correcto, sin regresión.
- `.ro-field` con input enfocado, tema base: `border-color: rgb(169, 160, 236)`
  y `box-shadow: rgba(169, 160, 236, 0.55)` — mismo tono, un solo anillo.
- Overrides de tema (`getComputedStyle(document.documentElement)` sobre
  `--ro-control-focus-border`): base `#a9a0ec`, `dark` → `#f6f072`,
  `high-contrast` → `#ffffff` — los tres coinciden ahora con el tono de
  `--ro-focus-ring` de su propio tema.
- `--ro-button-primary-fg` bajo `dark`: ahora `#171719` (el valor que el tema
  siempre debió aplicar), confirmando que el fix de orden de import corrige
  también ese bug latente, no solo el nuevo.
- `.ro-input` con foco real (clic, no `.focus()` por script):
  `outline-style: none` (antes `solid`) tras envolver `reset.css` en
  `@layer roui.reset`; el anillo de `.ro-field` (box-shadow + border,
  `rgb(169, 160, 236)`) queda como único indicador visible.
- Elemento SIN override propio (`.ro-switcher`, alcanzado con Tab real):
  sigue mostrando el outline por defecto de `reset.css`
  (`outline-style: solid`, `rgb(169, 160, 236)`) — confirma que el reset
  sigue aplicando su función original donde no hay anillo custom, solo dejó
  de pisar a los que sí lo tienen.
- `npm run validate`: correcto, 0 fallos (incluye `check:contrast`,
  `test:primitives`, `test:consumers`, axe en 68 páginas). Presupuesto:
  278009/278528 bytes descomprimidos — margen de ~519 bytes; a vigilar en el
  próximo cambio de tokens.

## Cierre

- Resultado: los tres bugs reportados quedan corregidos. Los últimos dos
  eran del bundle publicado (no solo de las plantillas de este sitio): el
  orden de import de temas y el `reset.css` sin capa afectaban a cualquier
  consumidor real que siguiera la guía de `getting-started.md`.
- Archivos: `src/index.css`, `src/base/reset.css`,
  `src/components/sidebar.css`,
  `src/components/input-group.css`, `tokens/tokens.json`,
  `src/tokens/components.css` y `src/tokens/themes.css` (generados),
  `dist/*` (rebuild).
- Comandos: `node scripts/build-tokens.mjs`, `npm run build`,
  `npm run validate`.
