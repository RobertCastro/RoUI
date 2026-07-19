# F6-004: Gobernanza del repositorio

- Estado: review
- Fase: 6
- Dependencias: F6-001..003
- ADR relacionados: ADR-0005

## Objetivo

Formalizar la gobernanza del repositorio: propietarios de código, plantillas de
contribución y la configuración recomendada de protección de rama.

## Contexto

El repo tenía CI y release automatizados, pero faltaban CODEOWNERS, plantillas de
PR/issues, guía de contribución y una política de protección de `main`.

## Alcance

- Incluido: `.github/CODEOWNERS`; plantilla de PR; plantillas de issues (bug y
  propuesta) con `config.yml`; `CONTRIBUTING.md`; `SECURITY.md` básico;
  `docs/governance/branch-protection.md` con la configuración recomendada y el
  comando `gh api`.
- Excluido: aplicar las protecciones de rama (ajuste de GitHub que hace el
  mantenedor); política completa de soporte/deprecaciones (F6-005).

## Progreso

- [x] `CODEOWNERS` con propietario global y áreas sensibles.
- [x] Plantilla de PR con checklist de gates, changeset y accesibilidad.
- [x] Plantillas de issues (bug, propuesta) y `config.yml`.
- [x] `CONTRIBUTING.md` (flujo, reglas, versionado) y `SECURITY.md` básico.
- [x] Documentación de protección de rama recomendada.

## Requisitos (acción del usuario)

- Aplicar la protección de `main` en GitHub (Settings → Branches) o con el `gh api`
  documentado. Con un solo mantenedor, ajustar las revisiones a 0 y mantener los
  checks de estado obligatorios.

## Criterios de aceptacion

- [x] CODEOWNERS, plantillas de PR/issues, CONTRIBUTING y SECURITY presentes.
- [x] La protección de rama recomendada está documentada y es aplicable.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run validate
git diff --check
```

## Cierre

- Resultado: gobernanza del repositorio con CODEOWNERS, plantillas, guía de
  contribución, política de seguridad básica y protección de rama documentada.
- Archivos: `.github/CODEOWNERS`, `.github/pull_request_template.md`,
  `.github/ISSUE_TEMPLATE/*`, `CONTRIBUTING.md`, `SECURITY.md`,
  `docs/governance/branch-protection.md`, `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: la protección de rama la aplica el mantenedor; política de
  soporte y deprecaciones en F6-005.
- Siguiente tarea desbloqueada: F6-005 (política de soporte, deprecaciones y
  vulnerabilidades).
