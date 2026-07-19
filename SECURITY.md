# Política de seguridad

## Versiones soportadas

Se da soporte de seguridad a la última versión menor publicada. Política completa
en
[docs/governance/support-deprecation-policy.md](docs/governance/support-deprecation-policy.md).

| Versión | Soporte |
|---|---|
| 1.1.x | ✅ |
| < 1.1 | ❌ |

## Reportar una vulnerabilidad

No abras un issue público para vulnerabilidades. Usa los
[Security Advisories privados](https://github.com/RobertCastro/RoUI/security/advisories/new)
del repositorio para reportarla de forma responsable.

Incluye: versión afectada, descripción, pasos de reproducción e impacto.

## Proceso y plazos

- **Acuse de recibo**: plazo objetivo de 3 días hábiles.
- **Evaluación**: se confirma y se asigna severidad (CVSS orientativo).
- **Corrección**: parche en la versión soportada; severidad alta o crítica se
  prioriza.
- **Divulgación coordinada**: se publica el aviso y la versión parcheada a la vez;
  se acredita a quien reportó si lo desea. Ventana objetivo: 90 días o antes si hay
  parche.

## Superficie

RoUI no tiene dependencias de runtime (el SBOM de producción no lista componentes
de terceros), lo que reduce la superficie de la cadena de suministro. Las
dependencias de desarrollo se vigilan con `npm audit`, Dependabot y CodeQL.
