# ADR-0003: Herramientas para fixtures consumidoras

- Estado: accepted
- Fecha: 2026-07-11
- Fase: 1

## Contexto

Los exports se resolvian desde una fixture temporal, pero el paquete no se
compilaba aun dentro de consumidores reales de CSS y Tailwind. Necesitamos una
prueba reproducible que instale exactamente el tarball que se publicaria.

## Decision

Usar esbuild 0.25 como bundler vanilla y Tailwind CSS 3 para una fixture del
preset CommonJS actual. Ambas son dependencias de desarrollo versionadas
mediante el lockfile. Las fixtures no forman parte del paquete npm publicado.

El test empaqueta RoUI, copia fixtures versionadas a un directorio temporal,
instala el tarball localmente y ejecuta ambos builds contra los entrypoints
publicos.

## Consecuencias

- CI gana compilacion real de consumidores sin depender de red durante el test.
- El soporte Tailwind de esta fase corresponde a su API de presets v3.
- El tooling de fixtures requiere Node 20 o superior.
- La futura salida generada para Tailwind se reevaluara en Fase 2 mediante
  tokens DTCG.

## Alternativas descartadas

- Inspeccionar archivos sin compilarlos: no prueba resolucion de bundlers.
- Usar Vite 4: el audit reporto vulnerabilidades moderada y alta en sus
  dependencias de desarrollo.
- Usar rutas internas: ocultaria errores de publicacion.
- Instalar herramientas en cada fixture: agrega trabajo de red innecesario.
