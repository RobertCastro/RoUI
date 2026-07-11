# F1-001: Corregir contrato de modulos Tailwind

- Estado: ready
- Fase: 1
- Dependencias: cierre de Fase 0, ADR-0002
- ADR relacionados: ADR-0002

## Objetivo

Publicar una integracion Tailwind que pueda cargarse mediante el contrato
documentado y probado desde una fixture consumidora.

## Alcance

- Incluido: formato de modulo, export de paquete, fixture CJS/ESM aplicable y docs.
- Excluido: generar Tailwind desde DTCG; corresponde a Fase 2.

## Criterios de aceptacion

- [ ] El entrypoint Tailwind se importa en los entornos soportados.
- [ ] El formato declarado coincide con la sintaxis del archivo.
- [ ] Una prueba consumidora usa el tarball generado.
- [ ] El contrato anterior se elimina, sin shim innecesario.
- [ ] README y package exports muestran el uso real.

## Plan de validacion

```bash
npm run validate
npm pack
# instalar tarball en fixture y cargar preset
```

