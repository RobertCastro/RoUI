# ADR-0002: Contrato de paquetes y modulos

- Estado: proposed
- Fecha: 2026-07-10
- Fase: 0

## Contexto

El paquete actual mezcla ESM con un preset Tailwind escrito en CommonJS. El
entrypoint `src` importa todo el CSS y no ofrece consumo granular estable.

## Decision propuesta

- Publicar entrypoints explicitos para tokens, reset, fundamentos, componentes
  y bundle completo.
- Probar importacion de cada entrypoint desde proyectos consumidores.
- Ofrecer ESM y CJS solamente donde el ecosistema lo requiera; nunca mezclar
  sintaxis y declaracion de modulo en un mismo artefacto.
- Considerar rutas internas privadas y no documentarlas.
- Mantener el reset como importacion explicita.

## Consecuencias

- El paquete puede dividirse durante la Fase 1.
- Los consumidores actuales conservaran un entrypoint compatible durante una
  ventana de migracion.
- La matriz de pruebas incluira Node y herramientas Tailwind soportadas.

## Validacion requerida

- `npm pack` reproducible.
- Fixtures vanilla, ESM y CommonJS importan los entrypoints declarados.
- Ningun entrypoint publico depende de archivos excluidos del paquete.

