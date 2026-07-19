# F6-005: Política de soporte, deprecaciones y vulnerabilidades

- Estado: done
- Fase: 6
- Dependencias: F6-004
- ADR relacionados: ADR-0005

## Objetivo

Publicar una política clara de soporte de versiones, proceso de deprecación de
componentes/API y manejo de vulnerabilidades.

## Contexto

F6-004 dejó la gobernanza del repo y un `SECURITY.md` básico. Faltaba formalizar la
ventana de soporte, cómo se deprecan componentes y el proceso completo de
vulnerabilidades.

## Alcance

- Incluido: `docs/governance/support-deprecation-policy.md` (versionado, ventana de
  soporte, estabilidad por madurez, proceso de deprecación); `SECURITY.md`
  ampliado (proceso y plazos de divulgación); `SUPPORT.md` (dónde pedir ayuda).
- Excluido: LTS formal (se revisa en Fase 7 al crecer la adopción).

## Progreso

- [x] Política de soporte y ventana de versiones documentada.
- [x] Proceso de deprecación ligado a la madurez y a la guía de migración.
- [x] `SECURITY.md` con acuse, evaluación, corrección y divulgación coordinada.
- [x] `SUPPORT.md` con canales de ayuda.

## Criterios de aceptacion

- [x] Existe una política pública de soporte y deprecación.
- [x] El proceso de vulnerabilidades define plazos y divulgación coordinada.
- [x] `SUPPORT.md` enlaza discusiones, issues y seguridad.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run validate
git diff --check
```

## Cierre

- Resultado: política de soporte y deprecaciones, proceso de vulnerabilidades con
  plazos, y guía de dónde pedir ayuda. Cierra el trabajo nominal de Fase 6.
- Archivos: `docs/governance/support-deprecation-policy.md`, `SECURITY.md`,
  `SUPPORT.md`, `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: LTS y compromisos de soporte a largo plazo dependen de la
  adopción (Fase 7).
- Siguiente: cierre de Fase 6 (auditoría) tras integrar F6-003/004/005.
