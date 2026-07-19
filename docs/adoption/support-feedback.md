# Soporte a consumidores y ciclo de feedback

Proceso para acompañar a los primeros consumidores de RoUI y convertir su feedback
en mejoras. La **ejecución real requiere consumidores**; este documento define el
proceso y las plantillas.

## Canales

- **Preguntas de uso**: GitHub Discussions.
- **Bugs y propuestas**: issues con las plantillas del repo.
- **Feedback de adopción**: plantilla "Feedback de adopción"
  (`.github/ISSUE_TEMPLATE/adoption_feedback.yml`).
- **Vulnerabilidades**: `SECURITY.md` (privado).

## Ciclo de feedback

1. **Recoger**: cada piloto abre un issue de feedback de adopción al empezar y al
   cabo de un periodo (p. ej. 2-4 semanas).
2. **Triage**: etiquetar por área (componente, primitiva, tokens, a11y, build,
   docs) y severidad.
3. **Priorizar**: lo que bloquea adopción va primero; lo que se repite entre
   pilotos sube de prioridad.
4. **Actuar**: convertir en tareas del roadmap o issues; los cambios con impacto
   llevan changeset.
5. **Cerrar el lazo**: responder al piloto qué se hizo y en qué versión.

## Métricas del proceso

- Tiempo de primera respuesta.
- % de feedback accionado por release.
- Repetición de temas entre pilotos (señala prioridades de producto).

Ver también las [métricas de adopción](adoption-metrics.md).

## Compromisos de soporte

Alineados con la [política de soporte](../governance/support-deprecation-policy.md):
soporte a la última versión menor; los cambios incompatibles siguen el proceso de
deprecación con guía de migración y codemod cuando aplica.

## Pendiente de piloto

- Designar consumidores piloto y abrir sus issues de feedback.
- Fijar la cadencia de revisión del feedback.
- Publicar un resumen periódico de lo aprendido y lo actuado.
