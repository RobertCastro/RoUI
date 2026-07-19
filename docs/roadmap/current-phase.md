# Fase activa: 7 — Adopción multi-proyecto

## Objetivo

Validar RoUI en productos independientes y medir su impacto: que otros proyectos
lo adopten con fricción baja y que se pueda cuantificar velocidad, defectos y
migraciones.

## Estado de entrada

Fase 6 cerrada y aprobada (ver `phase-6-audit.md`): `@robertcastro/roui@1.1.0`
publicado con provenance, versionado con Changesets, seguridad de cadena (CodeQL,
SBOM, dependency-review, Dependabot) y gobernanza del repositorio. Fases 0-5
cerradas.

## Trabajo permitido

- Pilotos de adopción en uno o más productos reales.
- Plantillas de arranque (starter) y ejemplos por stack priorizado.
- Codemods o guías para migrar patrones existentes a RoUI.
- Telemetría de adopción y métricas (velocidad, defectos, migraciones).
- Soporte a los primeros consumidores y recogida de feedback.

## Fuera de alcance

- Reescribir la arquitectura del paquete (estable desde Fase 2).
- Añadir componentes sin demanda de un piloto real.

## Orden inicial

1. F7-001: piloto de adopción en un producto y guía de arranque. (review)
2. F7-002: plantillas/starters por stack priorizado. (review)
3. F7-003: codemods o guía de migración de patrones a RoUI. (review)
4. F7-004: telemetría y métricas de adopción.
5. F7-005: soporte a consumidores y ciclo de feedback.

## Condiciones de salida

- Al menos un producto adopta RoUI en producción.
- Existen plantillas y guía de arranque reutilizables.
- Se miden métricas de adopción y se actúa sobre el feedback.
- Auditoría humana aprueba el cierre de Fase 7.

## Tareas de seguimiento heredadas

- Llenado de los 40 manifiestos de referencia restantes.
- Tematización de las demos y responsividad de plantillas (RTL/reflow).
- Documentación multi-versión.
- Revisión de las PRs de Dependabot abiertas (#34-#39) y aplicación de la
  protección de rama `main`.
