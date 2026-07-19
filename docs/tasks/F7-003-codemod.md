# F7-003: Codemod de migración de patrones a RoUI

- Estado: review
- Fase: 7
- Dependencias: F5-004 (guía de migración)
- ADR relacionados: ADR-0005

## Objetivo

Automatizar las conversiones deterministas de los patrones de clase de estado
heredados a los atributos ARIA de los contratos de RoUI.

## Contexto

La guía de migración (F5-004) documenta el antes/ahora, pero migrar a mano es
tedioso y propenso a error. Un codemod aplica las conversiones seguras.

## Alcance

- Incluido: `codemods/legacy-states.mjs` (transforma `ro-tab--active`,
  `ro-nav-link--active`, `ro-calendar__day--selected` y
  `ro-breadcrumbs__current--active` al atributo equivalente), con dry-run por
  defecto y `--write`; función `migrate()` exportada y probada; fixture, README,
  script npm y enlace desde la guía de migración.
- Excluido: los cambios de comportamiento (paneles `is-open`, listbox, foco) que
  se migran a mano; codemods para otros stacks.

## Progreso

- [x] Codemod quirúrgico (regex) que preserva el resto del marcado.
- [x] `migrate()` exportada y cubierta por 5 pruebas Node (en `validate`).
- [x] Fixture de ejemplo y README con tabla de conversiones y límites.
- [x] Script `codemod:legacy-states` y enlace desde la guía de migración.

## Criterios de aceptacion

- [x] El codemod convierte las clases de estado en atributos ARIA sin tocar el
  resto del marcado.
- [x] Dry-run informa y `--write` aplica; idempotente en lo básico.
- [x] Pruebas verdes dentro de `npm run validate` (35 pruebas).
- [x] Documentado y enlazado; los límites (comportamiento) quedan claros.

## Plan de validacion

```bash
node codemods/legacy-states.mjs codemods/__fixtures__/before.html
npm run validate
git diff --check
```

## Cierre

- Resultado: codemod `legacy-states` que automatiza la migración de las clases de
  estado a atributos ARIA, probado y documentado, complementando la guía de
  migración manual.
- Archivos: `codemods/{legacy-states.mjs,README.md,__fixtures__/before.html}`,
  `test/codemod-legacy-states.test.mjs`, `package.json` (script),
  `docs/reference/migration.md` (enlace), `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `node codemods/legacy-states.mjs …`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: las migraciones de comportamiento siguen manuales; el piloto
  real, telemetría (F7-004) y soporte (F7-005) dependen del mantenedor.
- Siguiente tarea desbloqueada: F7-004 (telemetría y métricas de adopción).
