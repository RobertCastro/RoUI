# Auditoria de cierre — Fase 6

- Fecha: 2026-07-19
- Estado: approved
- Rango: PR #27 a #33 (mergeados en `main`)

## Objetivo auditado

Convertir cada cambio en una release trazable y segura, con versionado
automatizado, publicacion verificable y controles de seguridad y gobernanza.

## Entregables

| Tarea | Resultado | Evidencia |
|---|---|---|
| F6-001 | Versionado y changelog con Changesets | done, PR #27 |
| F6-002 | Publicacion con provenance y canary | done, PR #29 |
| F6-003 | CodeQL, SBOM, dependency-review y Dependabot | done, PR #30 |
| F6-004 | Gobernanza (CODEOWNERS, plantillas, CONTRIBUTING, SECURITY) | done, PR #32 |
| F6-005 | Politica de soporte, deprecaciones y vulnerabilidades | done, PR #33 |

## Evidencia de calidad

- Pipeline de release probado en real: la accion de Changesets abrio la PR
  "Version Packages" y, al mergearla, se publico **`@robertcastro/roui@1.1.0`** en
  npm con provenance (`publishConfig.provenance` + `id-token: write`).
- Seguridad de cadena activa: CodeQL corre en push/PR; `dependency-review` en cada
  PR; SBOM CycloneDX generado en `main`; Dependabot ya abrio PRs de actualizacion
  (#34-#39).
- SBOM de produccion sin componentes de terceros: RoUI no tiene dependencias de
  runtime.
- Gobernanza: CODEOWNERS, plantillas de PR/issues, CONTRIBUTING, SECURITY, SUPPORT
  y politica de soporte/deprecaciones publicadas.
- `npm run validate` verde en cada PR de la fase.

## Cambios de contrato

- Los cambios con impacto para consumidores requieren un changeset.
- Las releases se publican desde CI con provenance; canary bajo el tag `canary`.
- Estabilidad y deprecacion se rigen por la madurez del componente.

## Riesgos transferidos y trabajo continuo

- Aplicar la proteccion de rama `main` es responsabilidad del mantenedor
  (documentada en `docs/governance/branch-protection.md`).
- Las PRs de Dependabot (#34-#39) quedan pendientes de revision.
- Trabajo continuo heredado: llenado de los 40 manifiestos de referencia,
  tematizacion de demos, responsividad de plantillas y docs multi-version.

## Recomendacion

Aprobar el cierre de Fase 6 y abrir Fase 7 (adopcion multi-proyecto): pilotos,
plantillas, codemods y telemetria de adopcion.

## Aprobacion humana

- [x] Entregables de Fase 6 verificados (1.1.0 publicado con provenance).
- [x] Controles de seguridad y gobernanza activos.
- [x] PRs #27-#33 integrados en `main`.
- [x] Autorizada la apertura de Fase 7.
