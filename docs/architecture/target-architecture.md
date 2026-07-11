# Arquitectura objetivo

## Modelo conceptual

```text
Lenguaje de diseno
  -> tokens primitivos
  -> tokens semanticos
  -> tokens de componente
  -> primitivas accesibles
  -> adaptadores por framework
  -> patrones y plantillas de producto
```

## Estructura objetivo

La migracion sera incremental. Esta estructura representa el destino, no una
autorizacion para mover todo en una sola tarea.

```text
packages/
  tokens/          fuente DTCG y transformaciones
  themes/          temas y marcas soportados
  css/             reset opcional, fundamentos y componentes visuales
  icons/           fuentes, optimizacion y contratos de iconos
  primitives/      comportamiento accesible independiente de la marca
  react/           adaptador React cuando sea priorizado
  tailwind/        integracion Tailwind versionada
  tooling/         lint, validadores y codemods
apps/
  docs/            documentacion contractual y playground
  visual-tests/    fixtures de regresion visual
examples/
  vanilla/
  vite-react/
  next/
```

## Limites arquitectonicos

- Tokens son independientes de componentes y frameworks.
- CSS no depende de React ni de una aplicacion consumidora.
- Las primitivas de comportamiento no contienen decisiones de marca.
- Los adaptadores consumen primitivas y estilos publicos; no rutas internas.
- Documentacion y ejemplos consumen los paquetes publicados o empaquetados, no
  atajos internos que oculten errores de distribucion.
- Todo entrypoint publico esta declarado y probado.
- Reset, tokens, componentes y utilidades se distribuyen en cascade layers
  explicitas y el reset es opcional o acotado.

## Contratos de compatibilidad

La matriz exacta se definira durante la Fase 0. Como minimo debe incluir:

- Versiones de Node usadas para build y herramientas.
- Navegadores y dispositivos soportados.
- Politica SSR e hidratacion para adaptadores.
- Politica de CSS moderno, fallbacks y progressive enhancement.
- Versiones de frameworks soportadas.

## Reglas de decisiones

Requieren ADR: fuente de tokens, estructura de paquetes, dependencia base de
accesibilidad, formato de modulos, estrategia de theming, compatibilidad,
versionado y cualquier cambio dificil de revertir.

