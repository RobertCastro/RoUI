# F0-012: Guía de composición de layouts + Container + sidebar único

- Estado: review
- Fase: 0 (backlog #15, ejecutado durante Fase 7)
- Dependencias: ninguna
- ADR relacionados: ADR-0001, ADR-0002

## Objetivo

Cerrar la brecha documental identificada en `docs/layouts.html`: no explicaba
`.ro-container`, no mostraba sus límites, no documentaba cuándo usar cada
primitiva de layout, y no existían variantes de ancho ni un patrón de "un solo
sidebar" (solo el de dos rails).

## Contexto

Auditoría del usuario contra el estado real del repo confirmó: falta sección de
Container, falta explicar diferencias entre `.ro-container`/`.ro-main`/`.ro-grid`/
`.ro-layout-2col`/`.ro-layout-3col`, falta mostrar límites visualmente, falta
guía de uso, faltan variantes `--narrow/--wide/--fluid`. Se descartó
explícitamente un componente React (`<Container />`): contradice la arquitectura
framework-agnóstica ya documentada (CSS + primitivas vanilla JS).

## Alcance

- Incluido: 3 tokens de ancho nuevos (`content-narrow` 48rem, `content-wide`
  96rem, más el `content-max` 80rem existente); variantes
  `.ro-container--{narrow,wide,fluid}`; nueva clase `.ro-layout-rail` (rail único
  - main, sin el hueco vacío que dejaría reusar `.ro-layout-3col` con un solo
    rail); reescritura completa de `docs/layouts.html` (composición corregida,
    sección Container con demo de límites y tabla de variantes, Stack & Row,
    guía de uso por primitiva); plantilla nueva `docs/templates/sidebar.html`
    (main + 1 sidebar, patrón que no existía); enlaces de navegación actualizados
    en 6 archivos.
- Excluido: página centrada, listado de tarjetas con componentes reales,
  formulario, página de documentación como patrón público — fuera de alcance
  por decisión explícita del usuario.

## Corrección al modelo propuesto

El árbol de composición original ponía `.ro-layout-3col` como hijo de
`.ro-container`. Es incorrecto: son ramas hermanas, mutuamente excluyentes — el
rail necesita ancho completo (llegar al borde del viewport), que un
`.ro-container` con `max-width` se lo impediría. Documentado explícitamente en
la nueva sección "Composición".

## Progreso

- [x] Tokens `content-narrow`/`content-wide` + variantes de `.ro-container`.
- [x] `.ro-layout-rail` (nueva): confirmado que reusar `.ro-layout-3col` con un
      solo `<aside>` dejaría un hueco de 440px vacío a ≥1280px (bug evitado antes
      de escribir la plantilla).
- [x] `docs/layouts.html` reescrita: árbol de composición corregido, sección
      Container (demo de límites + tabla de variantes + barras proporcionales),
      Stack & Row, guía "cuándo usar" en cada sección.
- [x] `docs/templates/sidebar.html`: plantilla real (directorio con nav lateral
      fija + listado), verificada en navegador.
- [x] Navegación actualizada en index/layouts/icons/components/tokens.html y en
      el `nav()` de `build-reference.mjs` (afecta 60 páginas generadas).

## Criterios de aceptacion

- [x] Cada literal/afirmación de la auditoría original verificado contra el
      código real antes de aceptarlo (no se asumió nada).
- [x] La sección Container muestra el límite visualmente y documenta las 4
      variantes con su valor exacto y cuándo usar cada una.
- [x] El nuevo patrón main+1 sidebar existe, renderiza correctamente y pasa axe.
- [x] `npm run validate` verde dentro del presupuesto.

## Plan de validacion

```bash
npm run build
npm run check:literals
npm run validate
git diff --check
```

## Cierre

- Resultado: documentación de layouts completa y corregida, con un patrón de
  composición nuevo (rail único) que cierra una brecha real del sistema, no
  solo de la documentación.
- Archivos: `tokens/tokens.json` (3 tokens), `src/tokens/layout.css`
  (regenerado), `src/layouts/shell.css` (variantes container),
  `src/layouts/three-col.css` (`.ro-layout-rail`), `docs/layouts.html`
  (reescrita), `docs/templates/sidebar.html` (nueva), `scripts/check-axe.mjs`
  (+1 página), `scripts/build-reference.mjs` (nav actualizado), 5 páginas de
  docs (nav actualizado), `docs/quality/literal-policy.md` (hash actualizado),
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build`, `npm run check:literals`, `npm run validate`,
  `git diff --check`.
- Riesgos pendientes: presupuesto de paquete de nuevo ajustado (~1 KiB de
  margen tras esta tarea); página centrada, listado de tarjetas, formulario y
  página de documentación quedan fuera de alcance por decisión explícita, no
  por olvido.
