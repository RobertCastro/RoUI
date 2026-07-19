# F7-001: Guía de arranque y starter de adopción

- Estado: review
- Fase: 7
- Dependencias: Fase 6 (paquete publicado)
- ADR relacionados: ADR-0005

## Objetivo

Reducir la fricción de adopción de RoUI con una guía de arranque y un ejemplo
mínimo verificable que consuma el paquete publicado.

## Contexto

RoUI 1.1.0 está publicado con provenance, pero faltaba una entrada clara para
adoptarlo (npm o CDN) y un ejemplo que demuestre el consumo real.

## Alcance

- Incluido: guía de arranque (`docs/reference/getting-started.md` → HTML del sitio,
  enlazada desde el índice); ejemplo `examples/starter/` que consume RoUI desde el
  CDN sin build (CSS + primitiva ESM), verificado en navegador.
- Excluido: el piloto en un producto real (decisión del mantenedor); plantillas por
  framework (F7-002); telemetría de adopción (F7-004).

## Progreso

- [x] Guía de arranque: npm y CDN, CSS, temas, primitivas y notas por framework.
- [x] Página `getting-started` renderizada y enlazada desde el índice.
- [x] Starter `examples/starter/` consumiendo el CDN (jsDelivr).

## Verificación

Servido por HTTP, el starter carga `dist/roui.min.css` desde el CDN (botón primary
con el color de marca) y la primitiva `overlay-controller` como módulo ESM del CDN;
el diálogo abre con foco atrapado y `aria-expanded=true`. URLs del CDN comprobadas
(HTTP 200) sobre `@robertcastro/roui@1.1.0`.

## Criterios de aceptacion

- [x] Guía de arranque publicada y enlazada en el sitio.
- [x] Starter mínimo que consume el paquete sin build.
- [x] Consumo desde CDN verificado en navegador (CSS + primitiva).
- [x] `npm run validate` y `git diff --check` verdes (26 páginas axe).

## Plan de validacion

```bash
npm run build:reference
npm run validate
git diff --check
npx serve examples/starter   # verificación manual del starter
```

## Cierre

- Resultado: guía de arranque en el sitio y starter por CDN verificado, que
  demuestran la adopción de RoUI 1.1.0 con y sin build.
- Archivos: `docs/reference/getting-started.md`, `scripts/build-reference.mjs`
  (render + enlace), `examples/starter/{index.html,README.md}`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: el piloto en un producto real y las plantillas por framework
  quedan para F7-002+.
- Siguiente tarea desbloqueada: F7-002 (plantillas/starters por stack priorizado).
