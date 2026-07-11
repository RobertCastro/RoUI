# F1-001: Corregir contrato de modulos Tailwind

- Estado: review
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

- [x] El entrypoint Tailwind se importa mediante CJS y ESM.
- [x] El formato `.cjs` coincide con `module.exports`.
- [x] Una prueba consumidora instala y usa el tarball generado.
- [x] El contrato `.js` anterior se elimino sin shim.
- [x] README y package exports muestran el uso real.

## Plan de validacion

```bash
npm run validate
npm pack
# instalar tarball en fixture y cargar preset
```

## Cierre

- Resultado: preset renombrado a `.cjs` y export publico corregido.
- Prueba: `scripts/test-package.mjs` instala el tarball en un directorio temporal
  y valida `require()` e `import()`.
- Comandos: `npm run validate`, `npm pack --dry-run`, `git diff --check`.
- Riesgo pendiente: los valores Tailwind siguen duplicados hasta Fase 2.
- Siguiente tarea: F1-002, entrypoints CSS publicos.
