# F0-020: Prettier, verificación de CHANGELOG y notas de RTL/densidad/accesibilidad

- Estado: review
- Fase: 0 (backlog #17, último ítem del backlog detallado de Fase 1)
- Dependencias: ninguna

## Objetivo

Cerrar el backlog #17: config de stylelint/prettier, CHANGELOG.md y notas de
RTL/accesibilidad.

## Contexto

Al revisar el estado real antes de tocar nada: **stylelint ya existía**
(`.stylelintrc.json`, corre en `npm run lint` dentro de `validate`) y
**CHANGELOG.md ya existía**, correctamente mantenido vía Changesets
(`@changesets/cli`, `changeset:version` lo regenera). Lo único realmente
faltante era Prettier y las notas de RTL/accesibilidad para consumidores
reales — `getting-started.md` no mencionaba RTL, densidad (recién agregada en
F0-019) ni un resumen de accesibilidad.

## Decisión de alcance: Prettier excluye CSS y HTML

Prettier no permite configurar el formato de CSS para preservar el estilo
denso (una línea por regla) que usa todo el proyecto — siempre expande a una
propiedad por línea. Medido en `src/components/*.css` +
`src/layouts/*.css` + `src/utilities/*.css` + `src/base/*.css`: 70722 → 73992
bytes (+4.6%) solo en las fuentes; `dist/roui.css` sin minificar crecería
proporcionalmente, arriesgando otra vez el presupuesto de paquete (~8.3 KiB de
margen tras F0-019) por una razón puramente estética. El mismo problema
apareció con HTML: probado en `docs/templates/sidebar.html`, Prettier
auto-cierra void elements (`<meta ... />`) y corta elementos inline de forma
extraña (`</svg\n>`), expandiendo el archivo un 43% (156 → 224 líneas) sin
aportar valor — todo el HTML del repo (75 archivos: docs, examples, fixtures,
codemods) es markup de demo/documentación escrito a mano, no configuración.
Se consultó al usuario ambas veces; ambas decisiones fueron excluir del
alcance de Prettier y dejar que `stylelint` siga gobernando la calidad del
CSS.

## Alcance

- Incluido:
  - `prettier` como devDependency (`^3.9.6`).
  - `.prettierrc.json` (`printWidth: 100` — el proyecto ya escribe líneas de
    hasta 135 caracteres regularmente; usar el default de 80 habría forzado
    reflow innecesario en 63+ líneas solo en `scripts/`).
  - `.prettierignore`: excluye `*.css`, `*.html` (ver decisión arriba),
    `dist/`, `tokens/tailwind.preset.cjs`, `CHANGELOG.md`,
    `package-lock.json` (generados/no se editan a mano) y artefactos de
    build/test (`node_modules/`, `test-results/`, `playwright-report/`,
    `coverage/`).
  - Scripts `format` (`prettier --write .`) y `check:format`
    (`prettier --check .`); `check:format` se agrega a la cadena de
    `npm run validate`, entre `lint` y `baseline`.
  - Reformateo real aplicado: 125 archivos (`.md`, `.mjs`, `.js`) — sobre
    todo `docs/tasks/*.md`, `docs/roadmap/*.md`, `scripts/*.mjs`,
    `src/primitives/*.js`, `test/**/*.mjs`. Los `.json` ya cumplían el
    default de Prettier (0 cambios).
  - `docs/reference/getting-started.md`: 3 secciones nuevas — "Densidad"
    (activación vía `data-ro-density`, tokens que responde, qué no responde
    aún), "RTL" (qué se probó realmente — sin scroll horizontal en 2 páginas
    representativas × 3 motores — y qué NO implica: no hay mirroring visual
    garantizado, solo 3 hojas de estilo usan propiedades lógicas, iconos
    direccionales no se voltean solos) y "Accesibilidad" (mapa de los 6
    contratos publicados en `accessibility/*.html`).
- Excluido: reformatear CSS/HTML con Prettier (ver decisión arriba); auditar
  o expandir el uso de propiedades lógicas CSS para RTL real — la nota deja
  explícito el estado actual en vez de prometer algo no verificado; generar
  changesets para el trabajo acumulado de esta sesión (F0-012 a F0-020) — es
  una decisión de release, no de tooling, fuera del alcance literal de esta
  tarea.

## Verificación

- `npx prettier --check .`: limpio tras el reformateo (0 archivos con
  diferencias dentro del alcance).
- Diffs de muestra revisados antes de aplicar `--write`: `.mjs` (rewrap de
  argumentos largos, sin cambio de comportamiento) y `.md` (normalización de
  comillas en snippets de código, saltos de línea de prosa) — ambos
  cosméticos y esperables.
- `npm run build:reference`: los `.md` fuente que alimentan páginas
  publicadas (`getting-started.md`, `accessibility/*.md`) se regeneraron tras
  el reformateo; `check:reference` limpio después.
- `npm run check:axe`: 68/68 páginas sin violaciones, incluida
  `getting-started.html` con las 3 secciones nuevas.
- `npm run validate`: correcto, 0 fallos (incluye el nuevo `check:format`
  dentro de la cadena).
- Presupuesto de paquete: 61936/65536 bytes comprimidos, 287082/294912 bytes
  descomprimidos (~7.6 KiB de margen — Prettier en el alcance elegido no lo
  movió de forma apreciable, ya que `.md`/`.mjs`/`.js` no cuentan hacia
  `dist/` ni se empaquetan en su mayoría salvo `src/primitives/*.js`, que
  cambiaron poco).

## Cierre

- Resultado: backlog #17 cerrado — último ítem del backlog detallado de
  Fase 1. Con esto, los 17 ítems del backlog quedan en estado `completed`.
- Archivos: `.prettierrc.json`, `.prettierignore`, `package.json`
  (dependency + scripts + `validate`), 125 archivos reformateados,
  `docs/reference/getting-started.md` (+ `.html` generado).
- Comandos: `npm install --save-dev prettier@3`, `npx prettier --write .`,
  `npm run build:reference`, `npm run check:axe`, `npm run validate`.
