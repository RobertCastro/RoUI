# F2-002: Generar temas desde DTCG

- Estado: done
- Fase: 2
- Dependencias: F2-001, ADR-0006

## Objetivo

Generar los temas light, dark y high-contrast desde la fuente DTCG y exponerlos
mediante `data-ro-theme` sin alterar el tema predeterminado.

## Criterios de aceptación

- [x] `themes.css` se genera desde DTCG.
- [x] Los temas light, dark y high-contrast redefinen roles semánticos.
- [x] El tema predeterminado conserva los valores actuales sin atributo.
- [x] El tarball publica y prueba `themes.css`.
- [x] La documentación explica activación y alcance.

## Cierre

- Resultado: temas activables con `data-ro-theme` y generados como artefacto
  público desde la fuente DTCG.
- Prueba: el tarball resuelve `themes.css` y comprueba sus tres selectores.
- Comandos: `npm run check:tokens`, `npm run validate`, `git diff --check`.
- Riesgo pendiente: los componentes que aún usan primitivas directas se migran
  a roles semánticos en F2-003.
- Siguiente tarea: tokens semánticos y de componente.
- Integración: PR #10 fusionado en `main` con CI correcta.
