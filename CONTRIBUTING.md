# Contribuir a RoUI

Gracias por tu interés. RoUI es un design system en CSS con primitivas accesibles
y una batería de gates automatizados. Estas son las reglas mínimas para contribuir.

## Requisitos

- Node.js 20 (`nvm use 20`). El build usa esbuild y las pruebas Node 20+.
- `npm ci` para instalar dependencias fijadas.

## Flujo

1. Crea una rama desde `main`.
2. Haz tu cambio siguiendo el estilo del código y los contratos de accesibilidad.
3. Ejecuta los gates locales:

   ```bash
   npm run validate        # tokens, contraste, literales, lint, baseline,
                           # pruebas, referencia, ejemplos, axe y presupuesto
   npm run test:e2e        # pruebas de navegador (si tocas comportamiento/UI)
   ```

4. Si el cambio afecta a quien consume el paquete, añade un changeset:

   ```bash
   npm run changeset
   ```

5. Abre una PR. La plantilla incluye el checklist requerido.

## Reglas

- **Accesibilidad primero**: los estados se dirigen desde semántica ARIA
  (`aria-selected`, `aria-expanded`, `aria-current`, `hidden`), no desde clases de
  estado. Ver `docs/accessibility/` y la guía de migración.
- **Sin dependencias de runtime**: las primitivas son ESM sin dependencias.
- **Presupuesto de paquete**: el gate `check:size` es obligatorio; justifica o
  reduce si tu cambio crece el tarball.
- **Documentación**: los componentes se documentan con un manifiesto en
  `docs/reference/components/*.json` (ver la referencia generada).
- **Commits**: describen el cambio, no la herramienta que lo produce.

## Versionado y releases

El versionado (SemVer) y el changelog se gestionan con
[Changesets](https://github.com/changesets/changesets). Al integrar en `main`, la
acción abre la PR «Version Packages»; al mergearla se publica a npm con provenance.
Ver `CHANGELOG.md` y `.changeset/README.md`.

## Seguridad

Para vulnerabilidades, no abras un issue público: sigue la política de
`SECURITY.md`.
