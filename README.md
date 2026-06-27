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
│  └─ tailwind.preset.js     # preset para proyectos Tailwind
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
<link rel="stylesheet" href="dist/roui.css">
<body class="ro-root"> … </body>
```

**B · Con bundler (Vite / PostCSS / Next)**
```js
import '@robertcastro/roui';          // dist/roui.css
// o, para tree-shaking del source:
import '@robertcastro/roui/src';      // src/index.css (@import)
```

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

## Publicar (privado · GitHub Packages)

El paquete es `@robertcastro/roui` y se publica en el registry privado de GitHub (visibilidad ligada al repo). El `.npmrc` del repo solo mapea el scope (sin secretos); el token va aparte.

**Publicar una versión**
1. Crea un **PAT** (GitHub → Settings → Developer settings → Tokens) con permisos `write:packages`, `read:packages` y `repo`.
2. Autentícate (en tu `~/.npmrc`, fuera del repo):
   ```
   //npm.pkg.github.com/:_authToken=TU_PAT
   ```
   o por entorno: `export NODE_AUTH_TOKEN=TU_PAT`
3. Sube la versión y publica:
   ```bash
   npm version patch        # o minor / major (crea tag git)
   npm publish              # prepare compila dist/ y publica
   git push --follow-tags
   ```

**Consumir en otro proyecto**
1. `.npmrc` del proyecto consumidor:
   ```
   @robertcastro:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=TU_PAT_DE_LECTURA   # mejor en ~/.npmrc o CI
   ```
2. Instala y usa:
   ```bash
   npm install @robertcastro/roui
   ```
   ```js
   import '@robertcastro/roui';   // dist/roui.css
   ```

> Requiere **Node ≥ 18** (recomendado) para publicar sin fricción. El repo incluye `dist/src/tokens` en el paquete (campo `files`) y excluye `docs/`.

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

### Interacciones (modal, toast, dropdown)
La librería aporta **solo estilos**; el comportamiento de demo vive en `docs/assets/docs.js` por `data-attributes` (reemplázalo por tu framework en producción):
- **Modal:** `[data-modal-open="id"]` abre `.ro-overlay#id`; `[data-modal-close]`, clic en backdrop o `Esc` cierran.
- **Toast:** `[data-toast="success|error|info"]` + `[data-toast-msg]` dispara un toast (autocierre 3.5s).
- **Tooltip:** sin JS — `class="ro-tooltip" data-tooltip="texto"`.

### Iconos (sin librerías ni PNG)
Set **Lucide** (MIT) distribuido como **sprite SVG** (`dist/icons.svg`, generado en el build desde `src/icons/icons.json`). Es la solución óptima: un solo archivo cacheable, sin dependencias, coloreable con `currentColor` y escalable.

```html
<!-- 1) inyecta el sprite una vez (inline al inicio del body, o fetch) -->
<!-- 2) referencia el símbolo -->
<svg class="ro-icon ro-icon--lg"><use href="#ro-i-bell"></use></svg>
```
Trade-offs: **sprite** (recomendado para HTML/CSS) · **inline** copia el `<svg>` directo (cero requests, ideal para 1-2 iconos críticos) · **componente por icono** (React/Vue) si ya usas un framework — el mismo path data sirve. Añadir un icono = una entrada en `icons.json` + `npm run build`.

### Dropdowns / menús
`.ro-dropdown` (wrapper) → `[data-dropdown-trigger]` + `.ro-menu` (panel). El estilo lo da la librería; la apertura/cierre la maneja `docs/assets/docs.js` (toggle, clic fuera, Esc) — cámbialo por tu framework en producción. Modificadores: `.ro-menu--end` (alinear derecha), `.ro-menu__item--danger`, `[data-single]` (selección única con check), `.ro-dot-badge` (punto de notificación).

## Layouts

`ro-app` (shell) · `ro-container` · `ro-row`/`ro-stack`/`ro-spacer` · `ro-grid`+`ro-col-*` (12 col) · `ro-cols-2/3/4` · `ro-cards` (auto-fit) · `ro-layout-3col` · `ro-layout-2col` · `ro-rail--left/--right` · helpers `ro-hide-mobile`/`ro-only-mobile`/`ro-fab`.

## Fidelidad / pendientes
- Capturado de `/dashboard`, `/directory` y `/paths/.../modules/architecting`, con medición responsive (~600px y ~1440px).
- `hover` inferido de clases Tailwind; `focus` usa el `--focus-ring` real.
- StackSans es propietaria → fallback automático a Inter.
- Header validado contra la app real: switcher, campana (con punto), idioma y avatar con dropdowns; avatar **sin borde** (el "borde negro" era el outline de foco del `<button>`, ahora reemplazado por el focus-ring de marca).
- Tablas, modales, toasts, tooltips y paginación se añadieron como componentes propios siguiendo el lenguaje visual (no estaban en las vistas capturadas; son extensiones coherentes con los tokens).
- El contenido de las plantillas/galería es **demo genérico** (workspaces *Acme Inc*/*Globex*, curso *Frontend · 4 semanas*), no datos reales del origen.
