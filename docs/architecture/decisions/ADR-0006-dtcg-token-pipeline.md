# ADR-0006: Pipeline de tokens DTCG sin dependencias de runtime

- Estado: accepted
- Fecha: 2026-07-11
- Fase: 2
- Propietario: mantenedores de RoUI

## Contexto

Los valores de diseño se editaban en CSS, JSON y el preset Tailwind. Esto
permitía divergencias y hacía imposible comprobar qué artefacto era canónico.

## Decisión

`tokens/tokens.json` es la única fuente editable, con claves DTCG (`$type`,
`$value`, `$description` y aliases). Las extensiones `org.roui` únicamente
describen el destino CSS de grupos de tokens; no duplican valores.

`scripts/build-tokens.mjs` valida referencias, detecta ciclos y genera los
cinco CSS de tokens y `tokens/tailwind.preset.cjs`. No se añade una dependencia
de runtime para transformar tokens. `npm run check:tokens` compara los
artefactos contra la fuente antes de escribirlos.

## Consecuencias

- Los CSS de tokens y el preset no se editan manualmente.
- La CI falla si se modifica un artefacto generado sin su fuente.
- Futuros temas y salidas de plataforma se agregan al generador o a un paquete
  de transformación cuando exista un consumidor real.

