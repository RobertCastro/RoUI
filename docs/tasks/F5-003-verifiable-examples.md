# F5-003: Ejemplos verificables y demos interactivas

- Estado: done
- Fase: 5
- Dependencias: F5-001, F5-002
- ADR relacionados: ADR-0005

## Objetivo

Garantizar que el codigo mostrado en la referencia no diverge del sistema y hacer
que las demos de patrones con comportamiento (overlays, etc.) sean interactivas en
sus paginas.

## Contexto

Las paginas de referencia mostraban ejemplos estaticos: no habia garantia de que
las clases/iconos usados existieran, ni interactividad para overlays. Ademas
`docs.js` resolvia el sprite relativo a la pagina, roto a la profundidad de
`docs/reference/`.

## Alcance

- Incluido: gate `check:examples` (valida que cada clase `ro-*` e icono `#ro-i-*`
  de anatomia y ejemplos existe en el bundle y el sprite); carga de `docs.js` en
  las paginas de componente (sprite + controladores) para demos interactivas;
  correccion de la resolucion del sprite en `docs.js` via `import.meta.url`;
  manifiesto de Modal con ejemplo interactivo. 6/49 documentados.
- Excluido: ejemplos por stack (React/Vue), guias de migracion (F5-004) y
  navegacion por versiones (F5-005).

## Progreso

- [x] `check:examples` verifica clases e iconos de los snippets (anti-divergencia).
- [x] `docs.js` resuelve el sprite desde el modulo (funciona a cualquier profundidad).
- [x] Las paginas de componente cargan `docs.js`: sprite + demos interactivas.
- [x] Manifiesto de Modal con demo interactiva (abre, atrapa foco, cierra).

## Criterios de aceptacion

- [x] `check:examples` falla si un ejemplo usa una clase o icono inexistente.
- [x] La demo de Modal abre y funciona en su pagina de referencia (verificado).
- [x] Las demos con icono renderizan en todas las paginas de referencia.
- [x] `npm run validate` (incluye `check:examples`) y `git diff --check` verdes.

## Plan de validacion

```bash
npm run check:examples
npm run build:reference
npm run validate
git diff --check
```

## Cierre

- Resultado: gate anti-divergencia de ejemplos + demos interactivas en la
  referencia (sprite y controladores via `docs.js`), con Modal como ejemplo
  interactivo verificado en navegador.
- Archivos: `scripts/check-examples.mjs` (nuevo), `scripts/build-reference.mjs`
  (carga `docs.js`), `docs/assets/docs.js` (sprite via `import.meta.url`),
  `package.json` (`check:examples` en `validate`),
  `docs/reference/components/modal.json`, paginas generadas,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run check:examples`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: 43 componentes por documentar; los ejemplos siguen siendo
  HTML/CSS (adaptadores por framework no entran en Fase 5).
- Siguiente tarea desbloqueada: F5-004 (madurez, do/don't y guias de migracion).
