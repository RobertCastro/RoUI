# Contratos accesibles: contenido, estructura y estado

Patrones sin comportamiento JS propio: contenido presentacional, estructura de
página y componentes de estado (progreso, carga, datos). El marcado aporta toda la
semántica; no hay controlador que gestione foco o teclado.

## Contenido presentacional

- **Iconos decorativos**: `aria-hidden="true"` en el `<svg>`; si el icono es el
  único contenido de un control interactivo, el nombre accesible va en el control
  (`aria-label`), no en el icono.
- **Divisores**: un separador puramente visual no necesita rol; si divide
  contenido semánticamente relevante, usa `role="separator"` (o el `<hr>` nativo).
- **Tipografía y prosa**: respeta una jerarquía de encabezados sin saltos
  (`h1`→`h2`→`h3`); no elijas el nivel por el tamaño visual sino por la estructura
  del documento.
- **Bloques de código**: usa `<pre><code>` para preservar espacios y permitir
  navegación por teclado del lector de pantalla; añade `aria-label` si el bloque
  necesita contexto adicional (p. ej. el lenguaje).

## Estructura de página

- **Landmarks**: `header`/`footer` a nivel de página son implícitos como
  `banner`/`contentinfo` solo si son hijos directos de `body`; anidados dentro de
  `article`/`section` pierden ese rol implícito.
- **Tarjetas y avatares**: una tarjeta clicable completa usa un enlace que envuelve
  el contenido (no un `div` con `onclick`); un avatar de solo imagen lleva `alt`
  descriptivo o `alt=""` si es puramente decorativo junto a un nombre visible.
- **Listas de descripción y timelines**: usa `<dl>/<dt>/<dd>` para pares
  término-descripción; una línea de tiempo es una lista (`<ol>`/`<ul>`) para que se
  anuncie el número de elementos.

## Estado y datos

- **Indicadores de progreso**: `role="progressbar"` con `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax` y nombre accesible; un spinner indeterminado usa
  `role="status"` con texto oculto (“Cargando…”) en vez de solo animación.
- **Skeletons**: el contenedor lleva `aria-busy="true"` y los bloques de esqueleto
  `aria-hidden="true"` (son ruido visual, no contenido); al cargar, quita
  `aria-busy` y anuncia el resultado si aplica.
- **Badges y tags**: un badge que solo repite información visual (color) debe tener
  texto o `aria-label` equivalente; un contador (`role="status"` opcional) se
  anuncia si cambia dinámicamente.
- **Tablas de datos**: `<th scope="col">`/`scope="row"` en encabezados; una tabla
  con scroll horizontal se envuelve en un contenedor con `tabindex="0"` y
  `aria-label` para que sea navegable por teclado.
- **Estados vacíos**: un mensaje de "sin resultados" se asocia a la región que
  actualiza (`aria-live="polite"` si sustituye contenido dinámicamente).

## Límites y verificación manual

- Estos patrones no requieren primitiva JS (sin foco que gestionar); componentes
  con interacción compleja (tabla ordenable, árbol navegable, segmented control con
  flechas) declaran su contrato de teclado como pendiente hasta incorporar un
  controlador dedicado.
- Verificación manual: comprobar con lector de pantalla que iconos decorativos no
  se anuncian, que las tablas anchas se navegan por teclado, y que
  `aria-busy`/`role=status` se comportan al cargar contenido real.
