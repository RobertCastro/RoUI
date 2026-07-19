# F7-005: Soporte a consumidores y ciclo de feedback (plantillas)

- Estado: review
- Fase: 7
- Dependencias: F7-004
- ADR relacionados: ADR-0005

## Objetivo

Definir el proceso de soporte a los primeros consumidores y el ciclo que convierte
su feedback en mejoras, con las plantillas listas.

## Contexto

El soporte real requiere consumidores. Se prepara el proceso, los canales y una
plantilla de feedback de adopción para arrancar en cuanto haya pilotos.

## Alcance

- Incluido: `docs/adoption/support-feedback.md` (canales, ciclo de feedback,
  métricas del proceso, compromisos de soporte) y plantilla de issue
  `.github/ISSUE_TEMPLATE/adoption_feedback.yml`.
- Excluido: la atención real a consumidores y el reporte de aprendizajes, que
  dependen de pilotos.

## Progreso

- [x] Proceso de soporte y ciclo de feedback documentado.
- [x] Canales definidos (discusiones, issues, feedback de adopción, seguridad).
- [x] Plantilla de issue "Feedback de adopción".
- [x] Compromisos de soporte alineados con la política de soporte.

## Criterios de aceptacion

- [x] Existe un proceso claro de soporte y feedback.
- [x] Hay una plantilla para recoger feedback de adopción.
- [x] `npm run validate` y `git diff --check` verdes.

## Estado real

Plantillas e infraestructura listas. La ejecución (acompañar consumidores, recoger
feedback y publicar aprendizajes) queda **bloqueada hasta tener pilotos**.

## Cierre

- Resultado: proceso de soporte y feedback con plantilla de adopción, listo para
  activarse con los primeros consumidores.
- Archivos: `docs/adoption/support-feedback.md`,
  `.github/ISSUE_TEMPLATE/adoption_feedback.yml`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: la atención real a consumidores depende de pilotos.
- Siguiente: cierre de Fase 7 cuando exista al menos un piloto en producción, o
  cierre parcial declarando la infraestructura de adopción completa.
