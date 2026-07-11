# F1-002: Definir entrypoints CSS publicos

- Estado: backlog
- Fase: 1
- Dependencias: F1-001, ADR-0002
- ADR relacionados: ADR-0002

## Objetivo

Permitir consumo explicito de tokens, fundamentos, reset opcional, componentes
individuales y bundle completo sin rutas internas privadas.

## Criterios de aceptacion

- [ ] Todos los entrypoints estan declarados en `exports`.
- [ ] Reset es opt-in.
- [ ] Cada ruta se prueba desde el tarball.
- [ ] El bundle completo sigue disponible mientras sea util.
- [ ] Rutas internas no documentadas no forman parte del contrato.

