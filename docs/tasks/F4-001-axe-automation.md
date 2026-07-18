# F4-001: Gate de accesibilidad automatizado (axe)

- Estado: review
- Fase: 4
- Dependencias: F3 (primitivas accesibles)
- ADR relacionados: ADR-0005

## Objetivo

Convertir la accesibilidad estructural en un gate obligatorio: ejecutar axe-core
sobre las páginas de documentación en cada `npm run validate` y en CI, sin
navegador ni red.

## Contexto

Fase 3 definió contratos ARIA por componente, pero no había verificación
automatizada: las regresiones de roles, nombres o landmarks solo se detectaban a
mano. Se necesita un gate reproducible antes de sumar Playwright y regresión
visual.

## Alcance

- Incluido: `scripts/check-axe.mjs` (axe-core + jsdom sobre las 7 páginas de
  `docs/`), script `check:axe`, integración en `validate` y corrección de todas
  las violaciones encontradas.
- Excluido: reglas que exigen renderizado (contraste, geometría) y estados
  dinámicos; se cubren en F4-002/003 con navegador. Regresión visual y matriz de
  navegadores: tareas posteriores de Fase 4.

## Límites conocidos del enfoque jsdom

- `color-contrast` se desactiva en el gate; lo cubre `check:contrast` sobre
  tokens (AA verificado en los tres temas).
- jsdom no calcula layout: reglas de geometría (p. ej. `target-size`) quedan
  como `incomplete`, no como violación. Se verifican con navegador en F4-002/003.
- Solo se evalúa el DOM estático inicial; los estados abiertos (diálogo, listbox,
  panel expandido) se prueban con Playwright en F4-002/003.

## Violaciones corregidas

- `button-name` (15): botones icónicos sin nombre — alert/banner/tag close,
  copiar código, estrellas de rating, navegación de calendario. Se añadió
  `aria-label` y `aria-hidden` en los `svg` decorativos.
- `label` (3) y `select-name` (1): switch, slider, number y select con
  `aria-label`.
- `landmark-unique`: `nav` de paginación y breadcrumbs, y los dos `aside` de la
  plantilla 3col, con nombres accesibles únicos.
- `region`: contenido del dashboard envuelto en `main`; barra de contexto del
  módulo marcada como `region` con nombre.
- `heading-order`: footer (`h4`→`h3`) y panel de recursos (`h3`→`h2`).

## Criterios de aceptación

- [x] `check:axe` ejecuta axe sobre las 7 páginas y falla si hay violaciones.
- [x] `validate` incluye `check:axe`; CI lo corre con Node 20.
- [x] Las 7 páginas pasan sin violaciones (contraste delegado a `check:contrast`).
- [x] `npm run validate` y `git diff --check` verdes dentro del presupuesto.

## Plan de validación

```bash
npm run check:axe
npm run validate
git diff --check
```

## Cierre

- Resultado: gate `check:axe` (axe-core + jsdom, sin red) integrado en `validate`
  y CI; 7 páginas sin violaciones tras corregir 40 nodos en la galería y las dos
  plantillas.
- Archivos modificados: `scripts/check-axe.mjs` (nuevo), `package.json`
  (script + `validate` + devDeps `axe-core`/`jsdom`), `package-lock.json`,
  `docs/components.html`, `docs/templates/dashboard.html`,
  `docs/templates/module-3col.html`, `src/components/footer.css`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos ejecutados: `npm run check:axe`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: cobertura de estados dinámicos y reglas de render (contraste
  visual, geometría) pendiente de F4-002/003 con navegador.
- Siguiente tarea desbloqueada: F4-002 (Playwright para Dialog, Drawer y Command
  Palette).
