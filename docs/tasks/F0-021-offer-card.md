# F0-021: Componente Offer card (extraído de app.lab10.ai)

- Estado: review
- Fase: 0 (componente nuevo, pedido directo del usuario)
- Dependencias: ninguna

## Objetivo

Agregar a RoUI un componente genérico de tarjeta de oferta inspirado en las
cards de "Programas populares" de `app.lab10.ai`, sin copiar contenido real
de negocio ni referencias al dominio de origen (cursos/cohortes).

## Contexto

El usuario mostró una captura de dos cards reales (`10x Builders - Cohorte
4` y `Code - 4 semanas`) y pidió extraer los estilos navegando a la app en
vivo con un perfil de Chrome específico. Se midieron los estilos
computados reales (`getComputedStyle`) de ambas tarjetas: colores, radios,
tipografía, padding — no se copió HTML/CSS fuente, solo valores visuales
observables.

Hallazgo relevante: los colores medidos coinciden **exactamente** con
tokens ya existentes en RoUI — `rgb(23,23,25)` = `--ro-ink`,
`rgb(169,160,236)` = `--ro-secondary`, `rgb(246,240,114)` ≈ `--ro-primary`,
`rgba(255,255,255,0.72)` = `--ro-on-dark-72`, radio `22px` = ya existente
`--ro-radius-banner`. No hizo falta agregar ningún token de color nuevo.

## Correcciones tras la primera versión

La primera versión (llamada `course-card`) tenía 3 problemas reales que el
usuario señaló en una revisión posterior:

1. **Texto no-lorem-ipsum**: los ejemplos usaban palabras reales del
   dominio ("clases", "inscritos", "Cohorte", "Nuevo", "Partner",
   "Inscríbete", "Continuar", "semanas", "usd") en vez de lorem ipsum en
   todo el contenido, no solo en el título/descripción.
2. **Layout**: el icono estaba solo en su propia fila, con el título debajo
   — el pedido explícito era que el título quedara junto al icono, en la
   misma fila.
3. **Dominio expuesto en el propio componente**: más allá del texto de
   ejemplo, el nombre de la clase (`ro-course-card`), el título del
   componente ("Course card"), y el icono elegido (`book-open`, específico
   de educación/lectura) hacían que el componente en sí mismo comunicara
   "esto es para cursos" — se pidió que no hubiera ninguna referencia a que
   es un curso.

Fix aplicado:

- Renombrado completo `ro-course-card` → `ro-offer-card` (archivo, clases,
  manifiesto, sección de la galería). Nombre genérico de "tarjeta de
  oferta", aplicable a planes, productos o promociones, no solo cursos.
- Icono cambiado de `book-open` (educación) a `star` (genérico).
- Layout: `.ro-offer-card__top` ahora es una fila `align-items:center` con
  icono + `<h3>` título; las insignias pasan a su propia fila debajo. El
  título ya no lleva `margin-top` propio (venía de estar apilado bajo el
  icono).
- Todo el texto de los 2 ejemplos (badges, meta, línea de highlights,
  precio, nota, CTA, estado "activo") reemplazado por vocabulario lorem
  ipsum — la única excepción es `$199` (símbolo + número, no es una
  palabra real). Los nombres de clase también se genericaron:
  `__classes` → `__highlights`, `__builders` → `__note`,
  `--enrolled` → `--active`.
- Verificado en vivo: `getComputedStyle` confirma icono y título en la
  misma fila (`iconLeftOfTitle`, diferencia de `top` < 10px), y un
  filtro de palabras prohibidas (`clases`, `inscrit`, `Cohorte`, `Nuevo`,
  `Partner`, `curso`, `semanas`, `usd`) sobre el texto completo de la
  tarjeta no encontró ninguna coincidencia.

## Alcance

- Incluido:
  - `.ro-offer-card` (+ `--dark`/`--accent` para el header) en
    `src/components/offer-card.css`: header coloreado (icono junto al
    título, insignias, meta, descripción, línea de highlights) + footer
    blanco (precio/estado + CTA, `margin-top: auto` para quedar siempre al
    fondo).
  - `.ro-badge--accent` nuevo en `badge.css` (fondo `--ro-primary`, texto
    `--ro-ink`) — reutilizable, no exclusivo de esta card.
  - Manifiesto `docs/reference/components/offer-card.json` con 2 ejemplos,
    ambos 100% lorem ipsum.
  - Sección "Offer card" agregada a `docs/components.html` (galería).
- Excluido explícitamente por el usuario:
  - El SVG de fondo decorativo de las cards originales — no se replicó.
  - El botón "Recomendar ruta" — no se incluyó en ningún ejemplo.
  - Todo el copy real del negocio y toda referencia al dominio de origen
    (cursos/cohortes) — ver "Correcciones" arriba.

## Verificación

- `getComputedStyle` en vivo sobre los 2 ejemplos renderizados en
  `docs/components.html`: icono y título en la misma fila (confirmado);
  búsqueda de palabras prohibidas sobre el texto completo de la tarjeta:
  sin coincidencias.
- Comparación contra las mediciones tomadas de la app real: radio de card
  (22px), fondo de header oscuro/accent, fondo del icono, fondo
  transparente del footer, color del estado activo (`rgb(16,185,129)` =
  `--ro-success`), tipografía del título (20px/700) — todos coinciden.
- `npm run check:examples`: 133 snippets, sin divergencias.
- `npm run check:axe`: `docs/reference/offer-card.html` y
  `docs/components.html` sin violaciones; 69/69 páginas en general.
- `npm run validate`: correcto, 0 fallos.
- `check:literals`: 382 → 388 (componente nuevo) → 387 tras el rediseño
  (`__meta` pasó a usar `var(--ro-space-2)` en vez de un `2px` literal).
  Digest actualizado dos veces, documentado en `literal-policy.md`.
- Presupuesto de paquete: no alcanzaba en la primera versión (296702 vs
  294912; el componente nuevo más el crecimiento real de `CHANGELOG.md`
  tras la publicación 1.2.0 que ya había ocurrido). Se subió
  `limits.unpacked` de 288KB a 296KB en `check-package-size.mjs`, mismo
  patrón ya acordado con el usuario en F0-017. Presupuesto final tras el
  rediseño: 63896/65536 comprimidos, 296447/303104 descomprimidos (~6.5
  KiB de margen).

## Cierre

- Resultado: RoUI suma un componente de tarjeta de oferta genérico
  (`offer-card`), fiel al diseño visual de referencia pero sin ningún dato,
  asset ni referencia de dominio del negocio original.
- Archivos: `src/components/offer-card.css`, `src/components/badge.css`
  (`--accent`), `src/index.css` (import),
  `docs/reference/components/offer-card.json`, `docs/components.html`,
  `scripts/check-literals.mjs` (digest), `scripts/check-package-size.mjs`
  (límite unpacked), `docs/quality/literal-policy.md`.
- Comandos: `npm run build`, `npm run build:reference`,
  `npm run check:examples`, `npm run check:axe`, `npm run validate`.
