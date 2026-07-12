# F1-004: Crear fixtures consumidoras

- Estado: done
- Fase: 1
- Dependencias: F1-001, F1-002
- ADR relacionados: ADR-0002

## Objetivo

Validar el paquete como lo recibe un proyecto externo, instalando el tarball y
usando solamente entrypoints publicos.

## Criterios de aceptacion

- [x] Fixture vanilla carga CSS, layout y sprite de iconos.
- [x] Fixture esbuild importa entrypoints granulares desde el tarball.
- [x] Fixture Tailwind compila el preset CommonJS publicado.
- [x] CI ejecutara instalacion desde tarball y ambos builds con `npm run validate`.

## Cierre

- Resultado: fixtures versionadas en `fixtures/vite-vanilla` y
  `fixtures/tailwind`.
- Herramientas: esbuild 0.25 y Tailwind CSS 3, justificadas por ADR-0003.
- Prueba: `test:consumers` empaqueta RoUI, instala el tarball en ambos
  consumidores y verifica sus artefactos compilados.
- Comandos: `npm run validate`, `npm run test:consumers`, `git diff --check`.
- Riesgo pendiente: las versiones de prueba se revisaran con la matriz de
  soporte durante F1-006.
- Siguiente tarea: F1-005, decision de workspace.
- Integracion: PR #5 fusionado en `main` con CI correcta.
