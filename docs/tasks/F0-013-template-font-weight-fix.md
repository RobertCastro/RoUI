# F0-013: Corrección de pesos tipográficos faltantes en plantillas

- Estado: review
- Fase: 0 (bug de consistencia visual, reportado por el usuario)
- Dependencias: ninguna

## Objetivo

Corregir un bug real: 3 páginas (las plantillas standalone) pedían a Google
Fonts un subconjunto de pesos incompleto, causando que texto en peso 400 se
sustituyera visualmente por el peso 500 disponible más cercano.

## Diagnóstico

El usuario reportó "la tipografía no se ve la que corresponde". Se verificó en
navegador (`document.fonts`, `getComputedStyle`, red) y se encontró la causa
real: `docs/templates/{dashboard,module-3col,sidebar}.html` cargaban
`Inter:wght@400;500;600;700;800` (sin 300) y
`JetBrains+Mono:wght@500;600;700` (sin 400) — mientras el resto del sitio (5
páginas de docs + el generador de las 49 páginas de referencia) sí cargaban el
juego completo (`Inter:wght@300;400;500;600;700;800` +
`JetBrains+Mono:wght@400;500;600;700`).

Impacto confirmado: `.ro-header__title.ro-mono` en `module-3col.html` (el
título del módulo) no declara `font-weight` propio, hereda el peso normal
(400); al no estar ese peso cargado, el navegador sustituía por el 500
disponible — visualmente más pesado de lo previsto. `sidebar.html` heredó el
mismo bug al copiar el `<head>` de `module-3col.html` como base.

## Alcance

- Incluido: alinear el `<link>` de Google Fonts en los 3 archivos afectados al
  mismo conjunto completo de pesos usado en el resto del sitio.
- Excluido: self-hosting de fuentes (fuera de alcance de este fix puntual).

## Verificación

- `document.fonts.check('400 16px "JetBrains Mono"')`: `false` → `true` tras el
  fix, en `module-3col.html`.
- Captura visual: el título ahora renderiza en mono regular, distinguible del
  breadcrumb en mono bold (antes ambos se veían con peso similar).
- `npm run check:axe`: 0 violaciones en las 3 páginas.

## Cierre

- Resultado: las 8 páginas HTML del sitio + el generador de 49 páginas de
  referencia piden ahora exactamente el mismo conjunto de pesos tipográficos.
- Archivos: `docs/templates/{dashboard,module-3col,sidebar}.html`.
- Comandos: `npm run validate`, `git diff --check`.
