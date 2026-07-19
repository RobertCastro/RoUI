# Política de soporte y deprecaciones

## Versionado

RoUI sigue [SemVer](https://semver.org/lang/es/):

- **patch**: correcciones compatibles.
- **minor**: funcionalidad compatible hacia atrás.
- **major**: cambios incompatibles.

El versionado y el changelog se gestionan con Changesets; las releases se publican
desde CI con provenance.

## Ventana de soporte

- Se da soporte (correcciones y seguridad) a la **última versión menor** publicada.
- Las versiones anteriores dejan de recibir parches al salir una nueva minor,
  salvo vulnerabilidades críticas sin mitigación, evaluadas caso a caso.
- No hay compromiso de LTS mientras el proyecto tenga un solo mantenedor; se
  revisará al crecer la adopción (Fase 7).

## Estabilidad por madurez

La madurez de cada componente indica sus garantías (ver el índice de referencia):

- `experimental`: API sujeta a cambios sin aviso.
- `beta`: contrato definido; puede cambiar con aviso en una minor.
- `stable`: cambios incompatibles solo en una major, con deprecación previa.
- `deprecated`: con reemplazo y fecha de retiro.

## Proceso de deprecación

1. **Anuncio**: el componente o API pasa a `deprecated` en su manifiesto y en el
   changelog, indicando el reemplazo.
2. **Migración**: se documenta el camino en la guía de migración
   (`docs/reference/migration.html`).
3. **Periodo de gracia**: se mantiene al menos una versión **minor** completa
   antes de retirar.
4. **Retiro**: la eliminación ocurre en una versión **major**.

## Vulnerabilidades

El reporte y manejo de vulnerabilidades se rige por
[SECURITY.md](../../SECURITY.md): reporte privado, acuse en 3 días hábiles,
divulgación coordinada y parche en la versión soportada.

## Dónde pedir ayuda

Ver [SUPPORT.md](../../SUPPORT.md).
