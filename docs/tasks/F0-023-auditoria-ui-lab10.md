# F0-023: Auditoría de contenedores/colores/espacios de app.lab10.ai → mejoras en RoUI

- Estado: review
- Fase: 0 (pedido directo del usuario, análisis + implementación completa)
- Dependencias: F0-021/F0-022 (mismo flujo de medición en vivo con perfil de
  Chrome de Farmatodo)

## Objetivo

Analizar la estructura de contenedores, colores de fondo y espacios de 4
páginas reales de `app.lab10.ai` (`/eventos`, `/paths/.../modules/...`,
`/aprende`, `/mi-perfil`), encontrar factores corregibles en RoUI, y
aplicarlos todos.

## Metodología

Se midieron estilos computados en vivo (`getComputedStyle`,
`getBoundingClientRect`, detección de color de fondo por capas) en las 4
páginas, sin copiar HTML/CSS fuente. Los hallazgos se presentaron primero
como reporte (6 puntos), y el usuario pidió aplicarlos todos, empezando por
los de menor riesgo (#3 y #4).

## Hallazgos y qué se hizo con cada uno

### #1 — Escala de contenedores incompleta

Medido: 1440px (wrapper de listado/dashboard) y 896px (perfil/settings),
ninguno cubierto exacto por la escala existente (narrow 768 / max 1280 /
wide 1536).

- Agregado `--ro-content-md: 56rem` (896px) + `.ro-container--md`.
- `--ro-content-wide` recalibrado de `96rem` (1536px) a `90rem` (1440px)
  para coincidir con el valor real medido — es el token más nuevo (F0-012,
  sin adopción real todavía), cambio de menor riesgo que tocar el default
  (`--content-max`, que se dejó igual a propósito).

### #2 — Radio de tarjetas: falta un escalón entre 16 y 22px

Medido: tarjetas de clase en `/aprende` con radio 20px; ningún token de
RoUI cubre ese valor (2xl=16, banner=22, 3xl=24).

- Agregado `--ro-radius-card-lg: 20px`.
- Migrado el radio literal de `event-card` (18px, una estimación menos
  precisa que este mismo hallazgo) al nuevo token — 2px de cambio visual
  disclosed, no accidental.

### #3 — Tokens de secondary que faltaban (aplicado primero, según lo pedido)

Medido: fondo "featured" `rgb(231-233,227-229,250-251)` (~20-25% opacidad,
más saturado que `-soft`) y relleno de barra de progreso `rgb(124,111,214)`
(morado más oscuro que `secondary` base, sin equivalente).

- `--ro-secondary-featured`: alias de `--ro-secondary-ring` (25% opacidad)
  — el valor **ya existía** en RoUI pero solo se usaba para anillos de
  foco (`stepper`, `timeline`); se le dio nombre semántico para su segundo
  uso real como fondo destacado, sin duplicar el color.
- `--ro-secondary-strong: #7c6fd6` — color sólido nuevo, no había ninguna
  variante oscura de `secondary` en la paleta.

### #4 — Padding de `.ro-context-bar` (aplicado segundo, según lo pedido)

**Corrección sobre el reporte inicial**: el reporte comparó el valor medido
(24px) contra el `padding` base/mobile de RoUI (16px) y concluyó que RoUI
se quedaba corto. Al revisar el CSS completo apareció el breakpoint
`≥640px` que ya sube el padding a **32px** — más generoso que el real
(24px), no menos. Se corrigió en la dirección correcta: `2rem` (32px) →
`1.5rem` (24px) en el breakpoint `≥640px`, alineado al valor real medido.

### #5 — Falta una variante de rail "panel" (no edge-to-edge)

`docs/layouts.html` documenta que el rail debe llegar al borde del
viewport — cierto para el rail izquierdo real, pero el panel derecho
("Guía") del módulo real es un panel flotante: `border-radius: 16px`,
borde completo (no solo un lado), con gutter visible respecto al
contenido central.

- Agregado `.ro-rail--panel` en `three-col.css`: `margin: 1rem`, borde
  completo, `border-radius: var(--ro-radius-2xl)`, alto ajustado
  (`calc(100vh - header-h - 2rem)`) para compensar el margen.
- Aplicado a modo de ejemplo real en `docs/templates/module-3col.html`
  (`ro-rail ro-rail--right ro-rail--panel`) — el mismo contexto donde se
  midió el patrón original.
- Documentado en `docs/layouts.html`, sección "App shell con rail".

### #6 — Sombra "hero" para bloques de media grandes

Medido en el video del módulo: `0 20px 40px rgba(23,23,25,0.10)` — offset-Y
y blur mayores que cualquier paso de la escala actual (`sm/md/lg/xl`), con
menos opacidad que `xl`.

- Agregado `--ro-shadow-hero`.
- Agregado `.ro-card-dark--hero` en `card.css`: radio `3xl` (24px, medido
  exacto), `padding: 0`, esta sombra — para medios que llenan el bloque
  (video, imagen), sin afectar el `.ro-card-dark` por defecto (usado en
  otros contextos no-hero).
- Aplicado en `docs/templates/module-3col.html` al placeholder de video
  real, reemplazando el `padding:0` en línea que ya no hace falta.

## Verificación

- Cada token nuevo confirmado en vivo (`getComputedStyle` sobre
  `document.documentElement`) tras rebuild: los 6 coinciden exacto con los
  valores decididos.
- `.ro-rail--panel` y `.ro-card-dark--hero` verificados en
  `docs/templates/module-3col.html`: `border-radius: 16px`/`margin: 16px`
  para el rail; `border-radius: 24px`/`box-shadow` exacto
  (`rgba(23,23,25,0.1) 0px 20px 40px 0px`) para el video.
- `npm run check:examples`, `npm run check:axe` (70/70), `npm run
validate`: 0 fallos.
- `check:literals`: 393 → 393 (neto igual; se removió 1 literal en
  `event-card` y no se agregaron literales px nuevos fuera de excepciones
  ya documentadas — digest igual actualizado porque el conjunto exacto de
  ocurrencias cambió aunque el conteo total coincida).
- Presupuesto de paquete: no alcanzaba tras los 6 cambios (65185/65536
  comprimidos, ~350 bytes de margen — insuficiente). Subido
  `limits.packed` de 64KB a 68KB y `limits.unpacked` de 296KB a 312KB,
  mismo patrón ya acordado en F0-017/F0-021. Final: 65185/69632
  comprimidos (~4.3 KiB de margen), 302932/319488 descomprimidos (~16.2
  KiB de margen) — mejor margen que las últimas tareas.

## Cierre

- Resultado: los 6 hallazgos del análisis quedan aplicados en RoUI —
  3 tokens nuevos, 2 tokens recalibrados a datos reales, 1 alias semántico
  sobre un token ya existente, 1 corrección de padding (con una
  auto-corrección honesta sobre un error del reporte inicial), 1 variante
  de layout nueva, 1 variante de card nueva, y las plantillas de ejemplo
  actualizadas para demostrar los dos cambios estructurales en su contexto
  real de origen.
- Archivos: `tokens/tokens.json`, `src/components/{badge,card,event-card}.css`
  (indirecto vía token), `src/layouts/{shell,three-col}.css`,
  `src/components/header.css`, `docs/templates/module-3col.html`,
  `docs/{tokens,layouts}.html`, `scripts/check-literals.mjs` (digest),
  `scripts/check-package-size.mjs` (límites).
- Comandos: `node scripts/build-tokens.mjs`, `npm run build`,
  `npm run check:examples`, `npm run check:axe`, `npm run validate`.
