# Fase activa: 6 — Releases, seguridad y gobernanza

## Objetivo

Convertir cada cambio en una release trazable, segura y de evolución predecible:
versionado formal, publicación verificable y controles de seguridad y gobernanza.

## Estado de entrada

Fase 5 cerrada y aprobada (ver `phase-5-audit.md`): documentación como producto
con referencia por componente, contratos de accesibilidad, guía de migración,
madurez, ejemplos verificables e interactivos, búsqueda y changelog. Gates de
Fases 1-4 estables (tokens, contraste, literales, lint, baseline, primitivas,
axe, navegadores, visual, presupuesto).

## Trabajo permitido

- Versionado y notas de release automatizadas (Changesets o equivalente).
- Publicación verificable: provenance de npm, canary/prerelease.
- Seguridad de cadena: SBOM, análisis estático (CodeQL), auditoría de dependencias.
- Gobernanza del repositorio: CODEOWNERS, protecciones de rama, política de
  soporte, deprecaciones y gestión de vulnerabilidades.

## Fuera de alcance

- Documentar componentes nuevos sin necesidad de release (continúa como trabajo
  de Fase 5 en backlog).
- Adopción multi-proyecto (Fase 7).

## Orden inicial

1. F6-001: versionado y changelog automatizados (Changesets). (review)
2. F6-002: publicación con provenance y prerelease/canary. (review)
3. F6-003: seguridad de cadena (SBOM, CodeQL, auditoría). (review)
4. F6-004: gobernanza del repositorio (CODEOWNERS, protecciones de rama). (review)
5. F6-005: política de soporte, deprecaciones y vulnerabilidades.

## Condiciones de salida

- Cada release es trazable (versión, notas, artefactos verificables).
- Los controles de seguridad y gobernanza corren en CI de forma obligatoria.
- Existe una política pública de soporte, deprecación y vulnerabilidades.
- Auditoría humana aprueba el cierre de Fase 6.

## Tareas de seguimiento heredadas

- Llenado de los 40 manifiestos de referencia restantes (Fase 5, continuo).
- Tematización de las demos (`--ro-text` en vez de `--ro-ink` crudo).
- Responsividad de plantillas: RTL/reflow a 320 px.
- Documentación multi-versión (depende del pipeline de release de esta fase).
