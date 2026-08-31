# F0-022: Componente Event card (extraído de app.lab10.ai/eventos)

- Estado: review
- Fase: 0 (componente nuevo, pedido directo del usuario)
- Dependencias: F0-021 (mismo flujo de extracción de estilos + lorem ipsum
  estricto, aplicado desde el inicio esta vez)

## Objetivo

Agregar a RoUI un componente de fila de evento (bloque de fecha + insignias

- título + meta + CTA), inspirado en el listado de `app.lab10.ai/eventos`,
  sin contenido real de negocio ni palabras fuera de lorem ipsum.

## Contexto

El usuario mostró una captura de una fila de evento real ("Conecta Claude y
ChatGPT a datos del gobierno.") y pidió extraer los estilos navegando a
`/eventos` con el mismo perfil de Chrome de F0-021. Se aplicaron las
correcciones de esa tarea **desde el primer intento**, sin necesidad de una
segunda ronda: texto 100% lorem ipsum en todo el ejemplo (badges, meta, CTA,
abreviatura de mes), sin ninguna palabra real del dominio (ni "En vivo",
"Pasado", "Ver detalles", abreviaturas de mes/hora, ni el nombre "Lab10").

Se detectó que el listado real tiene bloques de fecha con distinto color por
fila (uno rosa/magenta, otro verde) — probablemente una codificación por
categoría de evento. Ninguno de los dos tonos exactos existe en la paleta de
RoUI (ink/primary/secondary/gray/sky + success/warning/error/info). En vez
de inventar tokens de color nuevos para una variante no pedida, se usó
`--ro-secondary-soft` (ya existente) como color por defecto del bloque de
fecha, documentando en el manifiesto que el color es sobreescribible por
instancia si se necesita codificación por categoría.

## Alcance

- Incluido:
  - `.ro-event-card` en `src/components/event-card.css`: fila flex con
    `__date` (bloque fijo 58×58, día + mes) y `__body` (insignias, título,
    meta en fuente monoespaciada, CTA).
  - Manifiesto `docs/reference/components/event-card.json` con 2 ejemplos
    (fila única; lista de 2 filas usando `.ro-stack--sm`), ambos 100%
    lorem ipsum.
  - Sección "Event card" agregada a `docs/components.html` (galería).
- Excluido: codificación de color por categoría (no se pidió; el bloque de
  fecha usa un único color por defecto, documentado como sobreescribible).

## Verificación

- `getComputedStyle` en vivo comparado contra las mediciones de la app real:
  radio de tarjeta (18px, exacto), bloque de fecha (58×58 con radio 15px,
  exacto), fuente de la línea de meta (JetBrains Mono, exacto) — todos
  coinciden.
- Filtro de palabras prohibidas (`en vivo`, `pasado`, `ver detalles`, `ago`,
  `lab10`, `jue`, `p.m.`) sobre el texto completo de la tarjeta renderizada:
  sin coincidencias.
- `npm run check:examples`: 136 snippets, sin divergencias.
- `npm run check:axe`: `docs/reference/event-card.html` y
  `docs/components.html` sin violaciones; 70/70 páginas en general.
- `npm run validate`: correcto, 0 fallos.
- `check:literals`: 387 → 393 px (geometría local sin equivalente exacto en
  la escala: radio de tarjeta 18px, bloque de fecha 58px/15px — misma
  excepción ya documentada).
- Presupuesto de paquete: correcto sin necesidad de subir el límite esta
  vez — 64518/65536 comprimidos (~1 KiB de margen), 300417/303104
  descomprimidos (~2.6 KiB de margen). **Margen ajustado**: el próximo
  componente probablemente sí requiera subir el límite o recortar
  contenido existente.

## Corrección: ancho al 100% del contenedor

El usuario preguntó si la tarjeta ocupa el 100% de su contenedor. No lo
hacía: los ejemplos tenían `style="max-width:520px"` puesto a mano en el
propio `<a class="ro-event-card">`. Se sacó ese `max-width` de los 2
ejemplos del manifiesto y de `docs/components.html`, pero eso solo no
alcanzó — el `<a>` seguía sin llenar el contenedor porque, sin un `width`
propio, un elemento flex-item con `align-items: stretch` en el padre
técnicamente debería estirarse solo, pero el resultado medido seguía
angosto. Se agregó `width: 100%` directo en `.ro-event-card`, más
`box-sizing: border-box` explícito (para que el `width: 100%` incluya el
padding/borde de la propia tarjeta incluso en consumidores que no importan
`reset.css`, que es el único lugar donde `box-sizing: border-box` se
aplica globalmente — ver F0-016).

Verificado en vivo: en `docs/reference/event-card.html`, las dos filas
dentro de `.ro-stack` miden exactamente el mismo ancho que el `.ro-stack`
(413.5px = 413.5px); en `docs/components.html`, la tarjeta ocupa el 100%
del espacio disponible dentro del padding del contenedor de demo (~522px
disponibles, ~520px de tarjeta — la diferencia de 2px es el borde de 1px a
cada lado, no una restricción real).

## Cierre

- Resultado: RoUI suma un componente de fila de evento (`event-card`),
  fiel a las medidas reales de referencia, sin ningún dato ni asset
  propietario, con las lecciones de F0-021 aplicadas desde el inicio, y
  que ocupa el 100% de su contenedor por defecto.
- Archivos: `src/components/event-card.css`, `src/index.css` (import),
  `docs/reference/components/event-card.json`, `docs/components.html`,
  `scripts/check-literals.mjs` (digest), `docs/quality/literal-policy.md`.
- Comandos: `npm run build`, `npm run build:reference`,
  `npm run check:examples`, `npm run check:axe`, `npm run validate`.
