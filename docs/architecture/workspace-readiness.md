# Criterios de preparacion para workspaces

Antes de migrar, cada paquete candidato debe declarar:

- Proposito y consumidor externo o interno concreto.
- API y entrypoints publicos.
- Dependencias permitidas y prohibidas.
- Comando de build, test y fixture consumidora.
- Politica de versionado y compatibilidad.
- Propietario responsable.

La primera migracion debe conservar `npm run validate` como puerta de calidad y
probar el tarball de cada paquete publicable. No se crean paquetes de marcador
de posicion ni se migra por anticipacion.

