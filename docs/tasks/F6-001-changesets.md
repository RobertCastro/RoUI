# F6-001: Versionado y changelog automatizados (Changesets)

- Estado: review
- Fase: 6
- Dependencias: F5-005 (CHANGELOG)
- ADR relacionados: ADR-0005

## Objetivo

Automatizar el versionado SemVer y la consolidación del changelog con Changesets,
de modo que cada cambio con impacto declare su bump y las releases sean trazables.

## Contexto

El CHANGELOG se mantenía a mano (sección "Sin publicar"), sin relación con el
versionado del paquete. Se adopta Changesets como fuente de los cambios sin
publicar y del bump de versión.

## Alcance

- Incluido: `@changesets/cli` (dev-only) y `.changeset/config.json`; scripts
  `changeset`, `changeset:status` y `changeset:version` (bump + regenerar la
  referencia); CHANGELOG reestructurado para que Changesets lo gestione; un
  changeset inicial (minor) para el trabajo acumulado desde 1.0.0; workflow
  `release.yml` que abre la PR "Version Packages" al integrar en `main`.
- Excluido: publicación a npm con provenance y prerelease/canary (F6-002).

## Requisitos del repositorio (acción del usuario)

- Habilitar en GitHub: Settings → Actions → General → "Allow GitHub Actions to
  create and approve pull requests", para que la acción pueda abrir la PR de
  versión.

## Progreso

- [x] Changesets instalado y configurado (`access: public`, `baseBranch: main`).
- [x] Scripts de versionado; `changeset:version` regenera `changelog.html`.
- [x] CHANGELOG reestructurado; changeset inicial minor (→ 1.1.0).
- [x] Workflow `release.yml` (solo PR de versión; publicación en F6-002).

## Criterios de aceptacion

- [x] `changeset status` reconoce el bump pendiente (minor).
- [x] `changeset:version` sube la versión, consolida el CHANGELOG y regenera la
  referencia (verificado localmente y revertido).
- [x] `.changeset/` no entra al tarball; `CHANGELOG.md` sí.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run changeset:status
npm run validate
git diff --check
```

## Cierre

- Resultado: pipeline de versionado/changelog con Changesets; al integrar en `main`
  se abre la PR "Version Packages" que sube la versión y consolida el changelog.
- Archivos: `.changeset/{config.json,README.md,accessible-primitives-and-docs.md}`,
  `.github/workflows/release.yml`, `package.json` (scripts + dev-dep), `CHANGELOG.md`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run changeset:status`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: la acción requiere el permiso de PRs en el repo; la
  publicación con provenance llega en F6-002.
- Siguiente tarea desbloqueada: F6-002 (publicación con provenance y prerelease).
