# F0-024: `dashboard.html` genérico + migración a `.ro-section`/`.ro-page-header`

- Estado: review
- Fase: 0 (pedido directo del usuario)
- Dependencias: F0-018 (dejó explícitamente esta migración como "candidato
  futuro"), F0-021 (mismo criterio de "sin referencias al dominio de
  origen")

## Objetivo

Quitar las referencias a cursos/aprendizaje de `docs/templates/dashboard.html`
(mismo criterio ya aplicado en `offer-card`/`event-card`: contenido genérico,
sin exponer el dominio de origen) y corregir elementos que quedaron
desactualizados con los cambios recientes de RoUI.

## Contenido genericado

Todo el texto de dominio (cohortes, módulos, semanas de curso, "aprender")
se reemplazó por un tema neutro de gestión de proyectos, reusando
exactamente los mismos componentes y la misma composición visual:

| Antes                                          | Ahora                                                         |
| ---------------------------------------------- | ------------------------------------------------------------- |
| "Bienvenido, Robert."                          | "Bienvenido de nuevo."                                        |
| "1 ruta de aprendizaje activa"                 | "1 proyecto activo"                                           |
| "Mis rutas" / "Explorar paths"                 | "Mis proyectos" / "Explorar proyectos"                        |
| "Frontend · 4 semanas 8%"                      | "Proyecto Alfa · 8%"                                          |
| "Cohort · Abril 2026"                          | "Activo · Abril 2026"                                         |
| "Semana 9 de 4 · 3 módulos completados" (*)    | "9 de 12 tareas completadas"                                  |
| "Sem 1/2/3/4"                                  | "Fase 1/2/3/4"                                                |
| "Continuar aprendiendo" / "...Aprendiendo →"   | "Continuar trabajando" / "Continuar →"                        |
| "El Arte del 'Technical Brief' (Architecting)" | "Definir el brief técnico"                                    |
| "Módulo 0/4 · Video"                           | "Tarea 0/4 · Documento"                                       |
| "API Sandbox" / "Modelos de IA vía API"        | "Integración con calendario" / "Sincroniza tus fechas límite" |

(*) "Semana 9 de 4" no tenía sentido gramatical en el original (semana 9 de
un total de 4) — se aprovechó para corregirlo, no solo genericizarlo.

`"En curso"` se dejó igual: es texto de estado genérico ("en progreso"), no
una referencia a "cursos" pese a la coincidencia de palabra.

## Elementos desactualizados corregidos

- **`style="padding-top:32px;padding-bottom:64px"` en `.ro-container`** →
  reemplazado por `.ro-section`. F0-018 introdujo esta clase señalando
  explícitamente esta plantilla como "candidato futuro" para la migración
  — quedaba pendiente hasta ahora. Cambio visual menor y disclosed: pasa de
  padding asimétrico (32/64px) a simétrico (32px, 40px en `≥1024px`).
- **`.ro-row.ro-row--between.ro-row--wrap` con `style="align-items:flex-end"`**
  → reemplazado por `.ro-page-header`, que F0-018 creó exactamente para
  este patrón (mismo `display:flex; justify-content:space-between;
align-items:flex-end; flex-wrap:wrap`).
- **Bug real encontrado en el callout inferior**: `<div class="ro-callout--soft" style="border-radius:16px;padding:18px">`
  usaba **solo el modificador**, sin la clase base `.ro-callout` — el
  `--soft` únicamente aporta el fondo/borde en gradiente, la estructura
  (radio, padding, `display:flex`) vive en `.ro-callout`. El estilo en
  línea no era redundante, estaba compensando esa clase base faltante con
  valores arbitrarios (16px/18px en vez de los reales 22px/20px·28px).
  Corregido agregando `.ro-callout` y envolviendo el eyebrow+texto en un
  `<div>` propio (así el `display:flex` fila del callout los trata como un
  solo bloque, igual que el ejemplo real en `docs/components.html`), en vez
  de restaurar el parche en línea.

## Verificación

- `getComputedStyle` en vivo: `.ro-section` → `padding: 32px` arriba/abajo;
  `.ro-page-header` → `display:flex; justify-content:space-between;
align-items:flex-end; flex-wrap:wrap`; callout corregido → `border-radius:
22px`, `padding: 20px 28px`, gradiente aplicado, eyebrow y texto
  apilados verticalmente (no en fila).
- `grep -i "curso\|módulo\|cohort\|semana\|aprend"`: sin coincidencias
  fuera de "En curso" (confirmado no relacionado).
- `npm run check:axe`: `docs/templates/dashboard.html` sin violaciones.
- `npm run validate`: correcto, 0 fallos. Presupuesto sin cambios (`docs/`
  no se empaqueta).

## Nota fuera de alcance

`docs/components.html` tiene otro `.ro-callout` de ejemplo con el texto
"Únete y deja que tu cohort te encuentre." — misma palabra de dominio
("cohort"), pero no se tocó: el pedido fue específicamente sobre
`dashboard.html`. Queda como candidato si se pide una pasada similar sobre
`components.html`.

## Cierre

- Resultado: `dashboard.html` sin referencias al dominio de origen,
  reusando el mismo esqueleto de componentes; migrado a las clases de
  layout que F0-018 dejó pendientes; corregido un bug real de markup
  (clase base de callout faltante) descubierto al limpiar el estilo en
  línea que lo enmascaraba.
- Archivos: `docs/templates/dashboard.html`.
- Comandos: `npm run check:axe`, `npm run validate`.
