# F5-006: Cobertura completa de la referencia (49/49)

- Estado: review
- Fase: 5 (trabajo continuo, ejecutado durante Fase 7)
- Dependencias: F5-001..005
- ADR relacionados: ADR-0005

## Objetivo

Documentar los 40 componentes que quedaban pendientes en la referencia (9/49 →
49/49), manteniendo el mismo nivel de precisión y los mismos gates que los
primeros 9.

## Contexto

La infraestructura de F5-001..005 quedó completa, pero solo 9 componentes tenían
manifiesto. El resto figuraba como "pendiente" en el índice, honesto pero
incompleto.

## Alcance

- Incluido: 40 manifiestos nuevos (`docs/reference/components/*.json`) para
  todos los componentes restantes del inventario; un nuevo contrato de
  accesibilidad `docs/accessibility/content-and-status.md` (patrones sin
  comportamiento JS: contenido presentacional, estructura de página, estado y
  datos) para los 19 componentes que no encajaban en los 6 contratos existentes;
  corrección de un gap real en `src/components/calendar.css`
  (`.ro-calendar__pad` sin regla propia, detectado por el gate).
- Excluido: promoción de madurez (todos siguen `experimental`, según el
  inventario); primitivas nuevas (segmented/tree documentan honestamente que su
  patrón de teclado completo — radiogroup / treeview — aún no existe).

## Método

Se paralelizó la redacción en 7 lotes por familia (7 agentes concurrentes), cada
uno con: el esquema exacto, el mapeo de contrato de accesibilidad ya decidido
(usando las claves reales de `GROUPS` en `scripts/build-reference.mjs`, no las
del inventario textual, que difieren para `command-palette`), instrucciones de
verificar cada clase/icono contra `dist/roui.css`/`dist/icons.svg` antes de
escribir, y la prohibición explícita de ejecutar scripts compartidos (build,
validate, git) para evitar condiciones de carrera entre agentes concurrentes.
Verificación centralizada después: regenerar, correr los gates, corregir lo que
fallara, validar de nuevo.

## Mapeo de contratos de accesibilidad

| Contrato | Componentes |
|---|---|
| `native-controls.md` | form, input-group, number-input, slider, rating, file-upload, tags-input |
| `tabs-accordion-navigation.md` | nav, breadcrumb, pagination, sidebar, accordion, stepper |
| `combobox-calendar-command-palette.md` | combobox, calendar, command-palette |
| `toast.md` | toast, banner |
| `content-and-status.md` (nuevo) | typography, icon, divider, code, prose, segmented, tree, list-group, table, badge, tag, progress, progress-ring, spinner, skeleton, empty, card, avatar, header, footer, description-list, timeline |

## Progreso

- [x] 40 manifiestos nuevos escritos y validados (49/49 total).
- [x] Nuevo contrato `content-and-status.md` para patrones sin primitiva JS.
- [x] Gap real cerrado: `.ro-calendar__pad` con regla CSS (`aspect-ratio: 1`).
- [x] `check:examples`: 127 snippets en 49 componentes, sin divergencias.
- [x] `check:reference`: sin drift. `check:axe`: 67 páginas sin violaciones.

## Criterios de aceptacion

- [x] El índice muestra 49/49 documentados, sin ningún "pendiente".
- [x] Cada manifiesto usa solo clases e iconos reales (verificado por gate).
- [x] Los componentes sin controlador de teclado completo (segmented, tree) lo
  declaran explícitamente en `whenNotToUse`, sin inventar comportamiento.
- [x] `npm run validate` y `git diff --check` verdes dentro del presupuesto.

## Plan de validacion

```bash
npm run build:reference
npm run validate
git diff --check
```

## Cierre

- Resultado: cobertura completa de la referencia (49/49), con un nuevo contrato
  de accesibilidad para patrones de contenido/estado y un gap real de CSS
  corregido en el camino.
- Archivos: 40 manifiestos nuevos en `docs/reference/components/`,
  `docs/accessibility/content-and-status.md` (nuevo),
  `src/components/calendar.css` (`.ro-calendar__pad`), páginas generadas,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: presupuesto de paquete ajustado
  (276048/278528 descomprimidos, ~2.4 KiB de margen); próximos cambios de CSS
  deberán vigilar `check:size`. Ninguno de los 49 componentes ha sido promovido
  de `experimental` — la promoción sigue el criterio del inventario (contrato +
  pruebas + axe + navegadores + visual).
- Siguiente: promoción de madurez por lotes cuando se añadan pruebas de
  comportamiento/visuales por componente (fuera de alcance de Fase 5/7).
