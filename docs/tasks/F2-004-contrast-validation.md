# F2-004: Validar contraste de tokens y temas

- Estado: done
- Fase: 2
- Dependencias: F2-002, F2-003

## Objetivo

Comprobar automáticamente las combinaciones semánticas críticas de cada tema
antes de publicar cambios de tokens o componentes.

## Criterios de aceptación

- [x] Se evalúan light, dark y high-contrast.
- [x] Page, surface, botones y controles alcanzan 4.5:1 o más.
- [x] La validación usa la fuente DTCG y overrides de tema.
- [x] `npm run validate` falla ante contraste insuficiente.

## Cierre

- Cobertura: 15 pares críticos de color; todos entre 15.03:1 y 21:1.
- Implementación: `check:contrast` resuelve aliases y overrides de tema desde
  DTCG antes de calcular luminancia.
- Corrección: dark y high-contrast redefinen el foreground del botón primario
  para conservar contraste sobre el acento.
- Comandos: `npm run check:contrast`, `npm run validate`, `git diff --check`.
- Siguiente tarea: inventario y migración de valores literales restantes.
- Integración: PR #12 fusionado en `main` con CI correcta.
