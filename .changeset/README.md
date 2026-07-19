# Changesets

Este directorio gestiona el versionado y el changelog de RoUI con
[Changesets](https://github.com/changesets/changesets).

## Cómo añadir un cambio

1. Tras un cambio con impacto para quien consume el paquete, ejecuta:

   ```bash
   npm run changeset
   ```

   Elige el tipo de versión (SemVer) y describe el cambio en una frase.

2. Se crea un archivo `.changeset/*.md`. Commítealo junto con tu cambio.

## Tipos de versión

- `patch`: corrección o ajuste sin cambios de API.
- `minor`: funcionalidad nueva compatible hacia atrás.
- `major`: cambio incompatible.

## Publicación

Al integrar cambios en `main`, la acción de Changesets abre una PR «Version
Packages» que consume los changesets, sube la versión y actualiza `CHANGELOG.md`.
La publicación a npm se configura en F6-002.
