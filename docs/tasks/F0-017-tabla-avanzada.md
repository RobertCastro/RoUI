# F0-017: Tabla avanzada

- Estado: review
- Fase: 0 (backlog #13, siguiente pendiente por orden de ID tras F0-016)
- Dependencias: ninguna

## Objetivo

Cerrar el backlog #13 "Tabla avanzada": header sortable, selección de filas
(checkbox), sticky header, alineación numérica y estado vacío integrado.

## Contexto

Revisión del componente `Table` existente: `ro-table__num` (alineación
numérica) ya estaba resuelto desde antes. Quedaban 4 mejoras reales, todas
confirmadas con el usuario vía scope check antes de implementar.

## Alcance

- Incluido:
  - `.ro-table__sort`: botón dentro de un `th` para disparar el reordenamiento.
    El estado (`aria-sort="none"|"ascending"|"descending"`) lo pone y
    actualiza el consumidor; RoUI solo tiñe el icono según ese atributo
    (`--ro-ink-30` sin ordenar, `--ro-ink` activo). Sin primitiva JS: es un
    contrato visual + ARIA, no un componente con estado propio — consistente
    con cómo RoUI evita JS salvo que sea imprescindible.
  - `.ro-table__select`: celda angosta y centrada para el checkbox de
    selección de fila, reutilizando `.ro-check` (ya existente en
    `form.css`, con `accent-color` y soporte nativo de `:indeterminate`). Sin
    CSS ni primitiva nueva para el checkbox en sí.
  - `.ro-table--sticky` + `.ro-table-wrap--scroll`: header fijo en scroll
    vertical. Requiere las dos clases juntas (el wrap acota el alto vía
    `--ro-table-scroll-max`, 480px por defecto, sobreescribible por instancia
    con `style="--ro-table-scroll-max:180px"`).
  - `.ro-table__empty-cell`: quita el padding de la celda que envuelve a
    `.ro-empty` (componente ya existente) en el patrón de estado vacío
    integrado — sin CSS nuevo para el estado vacío en sí, solo el ajuste de
    padding de la celda contenedora.
  - Manifiesto (`docs/reference/components/table.json`): 3 ejemplos nuevos
    (orden + selección, sticky header, estado vacío), clases/datos/tokens
    documentados, notas de a11y sobre `aria-sort`, `aria-label` por checkbox
    e `indeterminate` por script.
- Excluido: una primitiva JS de tabla (orden/selección reales) — fuera del
  alcance de un sistema de diseño CSS-first; el consumidor conecta su propia
  lógica sobre el contrato HTML/ARIA que aporta RoUI.

## Presupuesto de paquete (bloqueante, resuelto)

Con las 4 mejoras (incluso recortando comentarios al mínimo), el paquete
necesitaba ~1.9 KB descomprimidos más de los 519 bytes de margen que quedaban
tras F0-016. La gobernanza documentada en `phase-2-audit.md` prevé
explícitamente esta situación: "cambios futuros deben reducir contenido o
justificar una modificación del presupuesto". Se consultó al usuario, que
eligió subir el límite en vez de recortar alcance o buscar compresión en
contenido ya existente (opción más invasiva/riesgosa). Se subió
`limits.unpacked` en `scripts/check-package-size.mjs` de `272 * 1024` a
`288 * 1024` bytes — deja ~14.4 KB de margen real tras esta tarea, en vez de
comprimir cada feature futura contra un límite que no había crecido desde
Fase 1. `limits.packed` (comprimido) no se tocó: seguía con margen holgado
(~5 KB).

## Verificación

- `.ro-table__sort`: botón presente; icono `aria-sort="ascending"` en
  `rgb(23, 23, 25)` (activo), icono `aria-sort="none"` en
  `rgba(23, 23, 25, 0.3)` (mudado) — confirmado con `getComputedStyle`.
- `.ro-table__select .ro-check`: checkbox presente y estilado.
- `.ro-table--sticky thead th`: `position: sticky` confirmado por computed
  style.
- `.ro-table-wrap--scroll`: `max-height: 180px` (tomado del override inline
  del ejemplo) y `overflow-y: auto` confirmados.
- `.ro-table__empty-cell`: contiene `.ro-empty` real.
- `npm run check:examples`: 130 snippets verificados, sin divergencias.
- `npm run check:axe`: se detectó y corrigió una violación real
  (`landmark-unique`) por 3 ejemplos reutilizando el mismo
  `aria-label="Tabla de builders"` en `role="region"` — se le dio una
  etiqueta única a cada uno. Tras el fix: 68/68 páginas sin violaciones.
- `npm run validate`: correcto, 0 fallos. `--ro-table-scroll-max` se detectó
  como custom property sin definir en el baseline (falso positivo del uso
  como "slot" configurable por instancia) — corregido definiéndolo con
  valor por defecto dentro de la propia regla `.ro-table-wrap--scroll` en
  vez de solo como fallback de `var()`.
- Presupuesto final: 60436/65536 bytes comprimidos, 280455/294912 bytes
  descomprimidos.

## Cierre

- Resultado: Table pasa de tener solo hover/zebra/alineación numérica a
  cubrir las 5 capacidades pedidas en el backlog. Sigue `maturity:
  "experimental"` (sin primitiva JS propia).
- Archivos: `src/components/table.css`,
  `docs/reference/components/table.json`, `docs/reference/table.html`
  (generado), `scripts/check-literals.mjs` (digest), `scripts/check-package-size.mjs`
  (límite unpacked).
- Comandos: `npm run build:reference`, `npm run build`,
  `npm run check:examples`, `npm run check:axe`, `npm run validate`.
