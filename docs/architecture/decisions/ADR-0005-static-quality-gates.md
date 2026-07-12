# ADR-0005: Quality gates estaticos de Fase 1

- Estado: accepted
- Fecha: 2026-07-11
- Fase: 1
- Propietario: mantenedores de RoUI

## Contexto

RoUI ya valida build, exports y consumidores, pero aun necesita prevenir errores
estaticos de CSS, crecimiento accidental del paquete y dependencias productivas
vulnerables antes de abrir la fase de componentes accesibles.

## Decision

- Usar Stylelint 16 con reglas de alto valor que detectan sintaxis, propiedades,
  pseudo-selectores y declaraciones duplicadas sin imponer reformat masivo.
- Establecer presupuesto inicial de 64 KiB comprimidos y 256 KiB sin comprimir
  para el tarball npm.
- Generar siempre los artefactos desde `src` antes de validar y empaquetar.
- Ejecutar `npm audit --omit=dev --audit-level=high` en CI.

## Consecuencias

- `npm run validate` es la puerta local y de CI para build, lint, baseline,
  paquete, consumidores y presupuesto.
- Una ampliacion del presupuesto exige ADR o justificacion en la tarea.
- La auditoria de desarrollo se revisa antes de incorporar nuevas herramientas,
  pero no bloquea releases de la libreria publicada si las dependencias de
  produccion estan limpias.

