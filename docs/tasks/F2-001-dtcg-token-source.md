# F2-001: Migrar tokens a fuente DTCG unica

- Estado: review
- Fase: 2
- Dependencias: cierre de Fase 1, ADR-0001
- ADR relacionados: ADR-0001

## Objetivo

Reemplazar las fuentes editables duplicadas de CSS, JSON y Tailwind por una
fuente DTCG que genere los artefactos publicos.

## Criterios de aceptacion

- [x] Existe un esquema DTCG validado por el generador.
- [x] CSS, JSON y Tailwind se generan desde el mismo origen.
- [x] CI detecta artefactos generados desactualizados mediante `check:tokens`.
- [x] No quedan fuentes paralelas editables de los mismos valores.

## Cierre

- Fuente: `tokens/tokens.json` con `$type`, `$value`, aliases y metadata de
  destino no valorativa.
- Generador: `scripts/build-tokens.mjs` valida 112 tokens, referencias y ciclos.
- Artefactos: cinco CSS de tokens y preset Tailwind CommonJS.
- Comandos: `npm run check:tokens`, `npm run validate`, `git diff --check`.
- Siguiente tarea: temas light, dark y high-contrast.
