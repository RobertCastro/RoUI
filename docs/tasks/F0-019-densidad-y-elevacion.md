# F0-019: Tokens de densidad y escala de elevación

- Estado: review
- Fase: 0 (backlog #16)
- Dependencias: F0-016 (mismo bug de orden de import de temas, ya corregido — este task lo reutiliza)

## Objetivo

Cerrar el backlog #16: sombras `lg`/`xl` (escala de elevación) y modo
densidad (`compact`/`comfortable`) vía tokens de spacing.

## Contexto

Antes de esta tarea, `--ro-shadow-sm`/`--ro-shadow-md` eran las únicas
sombras, y **8 componentes distintos** (Modal, Drawer, Popover, Menu,
Command Palette, Tooltip, Toast, Combobox) usaban el mismo `--ro-shadow-md`
sin jerarquía real entre un tooltip y un modal. No existía ningún mecanismo
de densidad — el padding de controles estaba hardcodeado por componente.

Se consultó al usuario el alcance de ambas piezas antes de implementar (ver
"Decisiones" abajo).

## Alcance

### Elevación

- Incluido: `--ro-shadow-lg` (`0 12px 32px rgba(23,23,25,0.12)`) y
  `--ro-shadow-xl` (`0 20px 48px rgba(23,23,25,0.16)`) agregados a
  `tokens/tokens.json` (sección `effects`, sin variantes por tema — igual que
  `sm`/`md`). Reasignados: Modal y Command Palette (los overlays con mayor
  `z-index`) a `shadow-xl`; Drawer (panel persistente, más grande que un
  menú/popover pero no bloqueante como un modal) a `shadow-lg`. Popover,
  Menu, Tooltip, Toast y Combobox se quedan en `shadow-md` — no se tocaron.
- Excluido: reasignar Popover/Menu/Tooltip/Toast/Combobox — no se pidió y no
  hay una razón de jerarquía tan clara como con Modal/Drawer/Command Palette.

### Densidad

- Incluido: tokens `--ro-btn-py/px`, `--ro-input-py/px`,
  `--ro-table-cell-py/px` con **valor base idéntico al padding hardcodeado
  que ya tenía cada componente** (sin cambio visual por defecto), más
  overrides `[data-ro-density="compact"]`/`[data-ro-density="comfortable"]`
  (mismo patrón arquitectónico que `[data-ro-theme]`) en una nueva sección
  `density` de `tokens/tokens.json` → `src/tokens/density.css`. Conectados a
  3 componentes reales: `.ro-btn` (`button.css`), `.ro-input-box` +
  `.ro-input-group` input (`form.css`/`input-group.css`), `.ro-table tbody
td` (`table.css`).
- Excluido: refactor completo de densidad a todos los componentes
  (accordion, card, menu-item, etc.) — alcance grande, no pedido; queda como
  candidato futuro con el mismo patrón ya establecido.
- Nota de diseño: `.ro-btn--sm`/`.ro-btn--lg` (variantes de tamaño
  explícitas, ya existentes) fijan su propio padding y **no** responden a la
  densidad — es el comportamiento correcto: un tamaño explícito no debería
  cambiar por el contexto ambiental.
- Cambio visual deliberado y disclosed: el input de `.ro-input-group` pasa de
  `10px 12px` a `var(--ro-input-py) var(--ro-input-px)` (`0.625rem
0.875rem` = `10px 14px`) — mismo token que `.ro-input-box`, 2px más de
  padding horizontal. Consistencia entre dos inputs casi idénticos, no un
  ajuste accidental.

## Bug de arquitectura reutilizado (no nuevo, ya corregido en F0-016)

El mecanismo de densidad depende del mismo fix de orden de import
(`components.css` antes que `themes.css`/`density.css` en `src/index.css`)
que F0-016 corrigió para que los overrides de tema funcionaran. Sin ese fix
previo, `[data-ro-density="compact"]` nunca habría podido sobrescribir el
valor base definido en `components.css` — se construyó sobre una base ya
sólida en vez de repetir el error.

## Verificación

- `getComputedStyle` sobre botones reales en 3 contenedores
  (`[data-ro-density="compact"]`, sin atributo, `[data-ro-density="comfortable"]`):
  padding `8px/14px` → `10px/16px` (idéntico al valor original, sin
  regresión) → `12px/20px`.
- `--ro-shadow-xl`/`--ro-shadow-lg` confirmados por `getComputedStyle` en
  `docs/reference/modal.html`: valores exactos de la escala.
- `--ro-table-cell-py/px` confirmados sin cambio (`14px`/`16px`) en el valor
  base.
- `npm run check:examples`: 130 snippets, sin divergencias.
- `npm run check:axe`: 68/68 páginas sin violaciones (incluye
  `docs/tokens.html` con las 2 secciones nuevas).
- `npm run validate`: correcto, 0 fallos.
- `check:literals`: 386 → 382 px (neto). La tokenización de 4 paddings
  hardcodeados (`.ro-btn`, `.ro-input-box`, `.ro-table tbody td`,
  `.ro-input-group` input) es la primera migración real de la prioridad 1
  documentada en `literal-policy.md` ("valores que calzan con la escala de
  spacing"). Detalle completo del historial de digest en
  `docs/quality/literal-policy.md`.
- Presupuesto de paquete: 61874/65536 comprimidos, 286412/294912
  descomprimidos (~8.3 KiB de margen).

## Cierre

- Resultado: backlog #16 cerrado (elevación de 2 a 4 niveles con uso real en
  3 componentes; densidad funcional en 3 componentes con el mismo patrón
  arquitectónico que theming).
- Archivos: `tokens/tokens.json`, `scripts/build-tokens.mjs` (soporte para
  el nuevo `cssFile: "density"`), `src/index.css` (import de
  `density.css`), `src/components/{button,form,input-group,table,modal,drawer,command-palette}.css`,
  `docs/tokens.html` (secciones Elevación y Densidad),
  `docs/reference/components/{button,form,input-group,table}.json`
  (tokens + notas), `docs/reference/components/{modal,drawer,command-palette}.json`
  (tokens), `docs/quality/literal-policy.md`, `scripts/check-literals.mjs`
  (digest).
- Comandos: `node scripts/build-tokens.mjs`, `npm run build`,
  `npm run build:reference`, `npm run check:examples`, `npm run check:axe`,
  `npm run validate`.
