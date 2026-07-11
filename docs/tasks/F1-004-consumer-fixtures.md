# F1-004: Crear fixtures consumidoras

- Estado: backlog
- Fase: 1
- Dependencias: F1-001, F1-002
- ADR relacionados: ADR-0002

## Objetivo

Validar el paquete como lo recibe un proyecto externo, instalando el tarball y
usando solamente entrypoints publicos.

## Criterios de aceptacion

- [ ] Fixture vanilla carga CSS e iconos.
- [ ] Fixture de bundler importa entrypoints granulares.
- [ ] Fixture Tailwind carga el preset soportado.
- [ ] CI instala desde tarball, compila y falla ante archivos ausentes.

