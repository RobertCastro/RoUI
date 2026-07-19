# F7-002: Plantillas de adopción por stack (React y Vue)

- Estado: review
- Fase: 7
- Dependencias: F7-001
- ADR relacionados: ADR-0005

## Objetivo

Ofrecer plantillas de arranque por stack priorizado que muestren el patrón de
integración de RoUI (CSS + primitivas) en React y Vue.

## Contexto

F7-001 dejó la guía de arranque y un starter en vanilla. Faltaban ejemplos por
framework que demostraran cómo instanciar las primitivas dentro del ciclo de vida
de un componente.

## Alcance

- Incluido: `examples/react/` y `examples/vue/`, ejecutables sin build (CDN), que
  consumen RoUI 1.1.0 e integran la primitiva `overlay-controller`; READMEs;
  enlace desde la guía de arranque.
- Excluido: plantillas con bundler/SFC completas, Svelte/Angular y el piloto en un
  producto real (F7-003+).

## Patrón de integración

Instanciar la primitiva en el montaje sobre la ref del nodo y destruirla al
desmontar: `useEffect`/cleanup en React, `onMounted`/`onBeforeUnmount` en Vue. El
componente renderiza el marcado (roles y estado); la primitiva muta foco/`hidden`
sin conflicto porque no hay estado reactivo sobre esos nodos.

## Verificación

Servidos por HTTP y comprobados en navegador:

- React (esm.sh + htm): renderiza y el diálogo abre con foco atrapado.
- Vue (build completo `vue.esm-browser.prod.js` para compilar `template` en línea):
  renderiza y el diálogo abre con foco atrapado.

## Criterios de aceptacion

- [x] Ejemplos de React y Vue que consumen RoUI y una primitiva.
- [x] Ambos verificados en navegador (render + diálogo con foco atrapado).
- [x] Enlazados desde la guía de arranque; READMEs con cómo probar.
- [x] `npm run validate` y `git diff --check` verdes.

## Notas

- Vue con `template` en línea requiere el build con compilador
  (`vue.esm-browser`); el runtime-only no compila plantillas.

## Plan de validacion

```bash
npm run validate
git diff --check
npx serve examples/react   # y examples/vue
```

## Cierre

- Resultado: plantillas de adopción para React y Vue, ejecutables sin build y
  verificadas, con el patrón de integración de primitivas documentado.
- Archivos: `examples/react/{index.html,README.md}`,
  `examples/vue/{index.html,README.md}`, `docs/reference/getting-started.md`
  (enlace), `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: plantillas con bundler y otros stacks; piloto real y
  telemetría en F7-003+.
- Siguiente tarea desbloqueada: F7-003 (codemods o guía de migración de patrones).
