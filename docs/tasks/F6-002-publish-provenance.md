# F6-002: Publicación con provenance y canary

- Estado: review
- Fase: 6
- Dependencias: F6-001
- ADR relacionados: ADR-0005

## Objetivo

Publicar el paquete de forma verificable (provenance de npm) desde CI, y ofrecer
un canal prerelease/canary para probar cambios antes de una release estable.

## Contexto

F6-001 dejó el versionado con Changesets y la PR "Version Packages", pero sin
publicación. Falta cerrar el circuito hasta npm con procedencia verificable.

## Alcance

- Incluido: `publishConfig.provenance: true` y script `release`
  (`build` + `changeset publish`); paso de publicación en `release.yml` con
  `id-token: write` (OIDC) y autenticación npm; workflow `canary.yml`
  (`workflow_dispatch`) que publica un snapshot bajo el dist-tag `canary`.
- Excluido: SBOM y análisis estático (F6-003); gobernanza de repositorio (F6-004).

## Requisitos (acción del usuario)

- Añadir el secreto `NPM_TOKEN` en el repo (Settings → Secrets and variables →
  Actions). Token de automatización de npm con permiso de publicación.
- La publicación estable ocurre cuando se mergea la PR "Version Packages" (no
  quedan changesets) y `release.yml` ejecuta `npm run release`.

## Flujo

1. Se integran cambios con sus changesets en `main`.
2. `release.yml` abre/actualiza la PR "Version Packages".
3. Al mergear esa PR, `release.yml` publica a npm con provenance.
4. `canary.yml` (manual) publica snapshots `X.Y.Z-canary-*` en el tag `canary`.

## Criterios de aceptacion

- [x] `publishConfig.provenance: true` y script `release` presentes.
- [x] `release.yml` añade `id-token: write`, auth de registro y paso de publish.
- [x] `canary.yml` publica snapshot bajo el tag `canary` con provenance.
- [x] La publicación está gated en `NPM_TOKEN`; sin el secreto no publica.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run validate
git diff --check
```

Publicación real: requiere `NPM_TOKEN` en el repo; se verifica en el primer
release estable y en un canary manual.

## Cierre

- Resultado: publicación a npm con provenance desde `release.yml` al cerrar la PR
  de versión, y canal `canary` on-demand. Gated en `NPM_TOKEN`.
- Archivos: `.github/workflows/release.yml` (publish + OIDC + auth),
  `.github/workflows/canary.yml` (nuevo), `package.json`
  (`publishConfig.provenance`, script `release`),
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: el usuario debe añadir `NPM_TOKEN`; primera publicación por
  verificar en real. SBOM/CodeQL y gobernanza en F6-003/004.
- Siguiente tarea desbloqueada: F6-003 (SBOM, CodeQL y auditoría de dependencias).
