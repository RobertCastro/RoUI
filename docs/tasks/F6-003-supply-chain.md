# F6-003: Seguridad de cadena (SBOM, CodeQL y auditoría)

- Estado: review
- Fase: 6
- Dependencias: F6-001
- ADR relacionados: ADR-0005

## Objetivo

Añadir controles de seguridad de la cadena de suministro: análisis estático del
código (CodeQL), inventario de materiales (SBOM), revisión de dependencias en PR y
actualizaciones automatizadas.

## Contexto

El CI ya auditaba dependencias de producción (`npm audit --omit=dev`), pero
faltaba análisis estático, SBOM y control de dependencias nuevas en cada PR.

## Alcance

- Incluido: workflow CodeQL para JavaScript (push/PR + semanal);
  `dependency-review-action` en PR (falla en severidad alta); generación de SBOM
  CycloneDX (`npm run sbom`, `--omit dev`) subido como artefacto en `main`;
  Dependabot para npm y github-actions.
- Excluido: gobernanza del repositorio (CODEOWNERS, protecciones de rama) en
  F6-004; política de soporte/vulnerabilidades en F6-005.

## Progreso

- [x] `codeql.yml` (JavaScript/TypeScript) en push/PR a `main` y cron semanal.
- [x] `supply-chain.yml`: `dependency-review` en PR + SBOM en `main`/manual.
- [x] `@cyclonedx/cyclonedx-npm` (dev) y script `sbom`; SBOM ignorado en git.
- [x] `dependabot.yml` (npm agrupando dev, y github-actions), semanal.

## Notas

- RoUI no tiene dependencias de runtime: el SBOM de producción tiene 0 componentes
  de terceros, lo que confirma una superficie de cadena mínima.

## Criterios de aceptacion

- [x] CodeQL analiza el JavaScript del repo.
- [x] Cada PR pasa por revisión de dependencias (falla en alta severidad).
- [x] Se genera y publica el SBOM en `main`.
- [x] Dependabot abre PRs de actualización.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run sbom
npm run validate
git diff --check
```

## Cierre

- Resultado: CodeQL, revisión de dependencias, SBOM CycloneDX y Dependabot añadidos;
  auditoría de producción ya existente reforzada.
- Archivos: `.github/workflows/{codeql,supply-chain}.yml`, `.github/dependabot.yml`,
  `package.json` (dev-dep + script `sbom`), `.gitignore` (sbom.json), CHANGELOG
  (limpieza del intro), `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run sbom`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: CodeQL/dependency-review requieren dependency graph habilitado
  (por defecto en repos públicos); gobernanza en F6-004.
- Siguiente tarea desbloqueada: F6-004 (CODEOWNERS y protecciones de rama).
