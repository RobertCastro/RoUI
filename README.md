# RoUI Design System

Design system **RoUI**: tokens, componentes y layouts en CSS modular — pensado para reaplicar la misma identidad en cualquier proyecto, con o sin Tailwind.

Los valores no son aproximaciones: se leyeron de los estilos computados del DOM.

## Estructura

```
dsystem/
├─ src/                      # FUENTE modular (estilo Tailwind)
│  ├─ tokens/                # variables: colors · typography · spacing · effects · layout
│  ├─ base/                  # reset.css
│  ├─ layouts/               # shell · grid · three-col
│  ├─ components/            # button · badge · card · form · nav · header · menu · sidebar · …
│  ├─ icons/                 # icons.json (fuente del sprite Lucide)
│  ├─ utilities/             # helpers.css
│  └─ index.css              # @import de todo (entry para bundlers)
├─ dist/                     # BUNDLE generado (para usar directo)
│  ├─ roui.css              # un solo archivo, sin @import
│  ├─ roui.min.css
│  └─ icons.svg              # sprite SVG de iconos
├─ tokens/
│  ├─ tokens.json            # design tokens (Style Dictionary / Figma Tokens)
│  └─ tailwind.preset.cjs    # preset CommonJS para proyectos Tailwind
├─ scripts/build.mjs         # genera dist/ desde src/ (sin dependencias)
├─ docs/                     # GALERÍA visual (abrir docs/index.html)
│  ├─ index.html  tokens.html  components.html  layouts.html
│  └─ templates/  dashboard.html · module-3col.html
└─ package.json
```

**Por qué esta estructura:** tokens separados de componentes (re-tematizas cambiando variables, no CSS), cada componente en su archivo (fácil de mantener y tree-shake mental), un bundle plano para consumo inmediato, y una galería para verlo todo.

## Ver la galería

Abre **`docs/index.html`** en el navegador (mejor servido por HTTP: `npm run dev` o cualquier server estático, para que el sprite de iconos se inyecte). Incluye: introducción, tokens, **iconos**, componentes (con **header y dropdowns interactivos**), layouts y dos plantillas completas (dashboard y módulo de 3 columnas). Redimensiona la ventana para ver el responsive.

## Usar en un proyecto

**A · Un solo archivo (cualquier stack)**
```html
<!-- local -->
<link rel="stylesheet" href="dist/roui.css">
<!-- o vía CDN (jsDelivr, sin instalar nada) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@robertcastro/roui/dist/roui.css">
<body class="ro-root"> … </body>
```

**B · Con bundler (Vite / PostCSS / Next)**
```js
import '@robertcastro/roui'; // bundle completo, sin reset global
```

**B.1 · Consumo granular (recomendado)**
```js
import '@robertcastro/roui/tokens.css';
import '@robertcastro/roui/components/button.css';
import '@robertcastro/roui/components/card.css';

// Opcionales y explicitos:
import '@robertcastro/roui/reset.css';
import '@robertcastro/roui/animations.css';
```

Tambien se publican `layouts/*.css`, `utilities.css`, `icons.svg`,
`bundle.css`, `min.css`, `tokens.json` y `tailwind`. Las rutas internas de
`src/` no forman parte de la API publica.

### Temas

`tokens.css` incluye los temas generados. El diseño actual se conserva sin
atributo; para activar un tema, aplica el atributo en el elemento raíz:

```html
<html data-ro-theme="dark">
```

Temas disponibles: `light`, `dark` y `high-contrast`. Los temas redefinen los
roles semánticos `--ro-bg`, `--ro-surface`, `--ro-text`, `--ro-text-muted`,
`--ro-border-color`, `--ro-accent` y `--ro-focus-ring`.

Las combinaciones críticas de cada tema se validan con `npm run check:contrast`
y deben mantener al menos una relación 4.5:1 para texto y controles.

Los controles principales consumen además tokens de componente generados. Para
usarlos sin el bundle completo, importa `@robertcastro/roui/component-tokens.css`
después de `tokens.css`.

El bundle declara este orden de cascada:

```css
@layer roui.tokens, roui.reset, roui.base, roui.layouts, roui.components, roui.utilities;
```

El reset no forma parte del bundle predeterminado. Si se necesita, debe
importarse explicitamente antes o junto a RoUI. Los estilos de una aplicacion
que no pertenezcan a una capa conservan precedencia sobre los layers de RoUI.

**C · Tailwind**
```js
// tailwind.config.js
module.exports = { presets: [require('@robertcastro/roui/tailwind')] }
```

## Build

```bash
npm install        # ejecuta `prepare` → genera dist/ automáticamente
npm run build      # src/ ──▶ dist/roui.css + dist/roui.min.css
```
El script lee el orden de `@import` de `src/index.css`, así que **añadir un componente** = crear `src/components/x.css` + una línea en `index.css`.

> **`dist/` no se versiona** (es build generado, está en `.gitignore`). Tras clonar, `npm install` lo recrea vía el script `prepare`. Si prefieres versionarlo (uso sin build), quita `dist/` del `.gitignore`.

## Publicar (público · npm)

Paquete público en npm: **`@robertcastro/roui`** (MIT). Cualquiera lo instala sin token.

**Publicar una versión** (automático vía GitHub Actions)
1. Crea un token **Automation** en npmjs.com → guárdalo como secret **`NPM_TOKEN`** en el repo (Settings → Secrets → Actions).
2. Lanza la versión:
   ```bash
   npm version patch        # o minor / major (crea commit + tag)
   git push --follow-tags   # el workflow publish.yml publica en npm
   ```
   (o manual: `npm publish --access public` con tu sesión `npm login`).

**Consumir en cualquier proyecto** (sin autenticación)
```bash
npm install @robertcastro/roui
```
```js
import '@robertcastro/roui';   // dist/roui.css
```
o por **CDN** (sin instalar):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@robertcastro/roui/dist/roui.css">
```

## Documentación (GitHub Pages)

La galería (`docs/`) se publica como sitio en cada push a `main` vía `pages.yml`.
Actívalo una vez en **Settings → Pages → Source: GitHub Actions**.
URL: `https://robertcastro.github.io/RoUI/`

## Convenciones (mejores prácticas)
- **Prefijo `ro-`** en todas las clases → sin colisiones con tu CSS existente.
- **Tokens primero:** todo color/medida es una variable `--ro-*`. Hay además **roles semánticos** (`--ro-bg`, `--ro-surface`, `--ro-text`, `--ro-accent`, `--ro-border-color`) que apuntan a primitivos para re-tematizar fácil.
- **BEM ligero:** bloque `.ro-card`, elemento `.ro-card__header`, modificador `.ro-card--plain`.
- **Escala neutra = `ink` + opacidad** (`--ro-ink-60`, `-10`…), igual que la app original.
- **Mobile-first:** los media queries usan los breakpoints de Tailwind (sm 640 · md 768 · lg 1024 · xl 1280).

---

## Resumen de tokens

| Grupo | Claves |
|---|---|
| Color marca | `ink #171719` · `primary #f6f072` · `secondary #a9a0ec` · `ink-soft #f7f7f8` · `gray #d9e3e3` · `sky #d4e0ed` |
| Semánticos | `success #10b981` · `warning #f59e0b` · `error #ef4444` · `info #3b82f6` |
| Tipografía | display 44 · 4xl 36 · 2xl 24 · xl 20 · base 16 · sm 14 · xs 12. Fuentes: **StackSans** (fallback Inter) + **JetBrains Mono** |
| Radios | sm 4 · lg 8 · xl 12 · card 14 · 2xl 16 · banner 22 · full |
| Layout | header 72 · rail-left 280 · rail-right 440 · content-max 1280 |
| Iconos | **Lucide** (viewBox 24, `currentColor`, stroke 2, tamaños 14/16/18/20) |

## Inventario de componentes

`button` · `badge`/`dot`/`status-chip` · `avatar`(+stack) · `icon` · `card`(+dark/row/callout/stat/resource) · `form`(field/input/textarea/select/label/check/switch) · `nav`(nav-link/pill/tabs) · `header`(+switcher/context-bar/breadcrumb) · `menu`/dropdown(+notif dot-badge) · `sidebar`(rail head/nav-item/step/accordion) · `progress` · `table`(+zebra/hover/toolbar) · `pagination` · `tooltip`(CSS-only) · `modal`(overlay/dialog) · `toast`(success/error/info) · `alert`(info/success/warn/error) · `skeleton` · `spinner`(+btn `is-loading`) · `empty`(empty state) · `drawer`(left/right/bottom-sheet) · `code`(inline/block/`kbd`) · `segmented` · `tag`(removible) · `accordion` · `breadcrumb`(standalone) · `stepper`(horizontal/vertical) · `popover` · `prose`(markdown de lecciones) · `combobox`(autocomplete) · `tags-input` · `slider` · `file-upload`(dropzone) · `input-group` · `rating` · `list-group` · `description-list` · `timeline` · `progress-ring` · `calendar`/`datepicker` · `command-palette`(⌘K) · `button-group`/`split-button` · `number-input` · `tree` · `typography`(display/h2/h3/body/eyebrow).

> **Color de marca:** además de los neutros/semánticos, varios componentes usan el lavanda (`--ro-secondary`) como acento de estado activo — stepper actual, chips del `tags-input`, slider, timeline activo, list activo, progress-ring — y el amarillo (`--ro-primary`) en rating y `alert--highlight`.

> **Nota:** todos los componentes comparten los mismos tokens, por lo que cualquier acento (lavanda/amarillo) o medida se re-tematiza desde `src/tokens/`.

### Interacciones (modal, toast, disclosures)
La librería aporta estilos y primitivas ESM opcionales; las demos consumen los
artefactos generados para que el contrato publicado sea el mismo que se ve:
- **Dialog y Drawer:** el controlador opcional `createOverlayController` se importa desde `@robertcastro/roui/primitives/overlay-controller`; proporciona foco inicial, trap de `Tab`, `Escape`, scroll lock y restauración del disparador. Consulta `docs/accessibility/dialog-drawer.md` para el marcado contractual.
- **Menu y Popover:** `createDisclosureController` se importa desde `@robertcastro/roui/primitives/disclosure-controller`; controla `aria-expanded`, Escape, interacción exterior y la navegación de Menu por teclado. Consulta `docs/accessibility/menu-popover-tooltip.md`.
- **Toast:** `[data-toast="success|error|info"]` + `[data-toast-msg]` dispara un toast (autocierre 3.5s).
- **Tooltip:** no necesita JavaScript, pero usa un elemento `role="tooltip"` asociado al disparador mediante `aria-describedby`.

### Iconos (sin librerías ni PNG)
Set **Lucide** (MIT) distribuido como **sprite SVG** (`dist/icons.svg`, generado en el build desde `src/icons/icons.json`). Es la solución óptima: un solo archivo cacheable, sin dependencias, coloreable con `currentColor` y escalable.

```html
<!-- 1) inyecta el sprite una vez (inline al inicio del body, o fetch) -->
<!-- 2) referencia el símbolo -->
<svg class="ro-icon ro-icon--lg"><use href="#ro-i-bell"></use></svg>
```
Trade-offs: **sprite** (recomendado para HTML/CSS) · **inline** copia el `<svg>` directo (cero requests, ideal para 1-2 iconos críticos) · **componente por icono** (React/Vue) si ya usas un framework — el mismo path data sirve. Añadir un icono = una entrada en `icons.json` + `npm run build`.

### Dropdowns / menús
`.ro-dropdown[data-ro-disclosure-root]` contiene un trigger
`[data-ro-disclosure-trigger]` y un panel
`[data-ro-disclosure-panel]`. El panel de Menu declara `role="menu"` y sus
acciones `role="menuitem"`; Popover usa `role="dialog"` solo cuando contiene
interacción. Modificadores: `.ro-menu--end` (alinear derecha),
`.ro-menu__item--danger`, `data-ro-select-single` (selección única) y
`.ro-dot-badge` (punto de notificación).

## Layouts

`ro-app` (shell) · `ro-container` · `ro-row`/`ro-stack`/`ro-spacer` · `ro-grid`+`ro-col-*` (12 col) · `ro-cols-2/3/4` · `ro-cards` (auto-fit) · `ro-layout-3col` · `ro-layout-2col` · `ro-rail--left/--right` · helpers `ro-hide-mobile`/`ro-only-mobile`/`ro-fab`.

## Fidelidad / pendientes
- Capturado de `/dashboard`, `/directory` y `/paths/.../modules/architecting`, con medición responsive (~600px y ~1440px).
- `hover` inferido de clases Tailwind; `focus` usa el `--focus-ring` real.
- StackSans es propietaria → fallback automático a Inter.
- Header validado contra la app real: switcher, campana (con punto), idioma y avatar con dropdowns; avatar **sin borde** (el "borde negro" era el outline de foco del `<button>`, ahora reemplazado por el focus-ring de marca).
- Tablas, modales, toasts, tooltips y paginación se añadieron como componentes propios siguiendo el lenguaje visual (no estaban en las vistas capturadas; son extensiones coherentes con los tokens).
- El contenido de las plantillas/galería es **demo genérico** (workspaces *Acme Inc*/*Globex*, curso *Frontend · 4 semanas*), no datos reales del origen.
