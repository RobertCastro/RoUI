# Baseline tecnico

Fecha inicial: 2026-07-10

Ultima reconciliacion: 2026-07-20

## Comando reproducible

```bash
npm run baseline
```

El comando falla ante imports duplicados o inexistentes y variables CSS usadas
sin definicion. Tambien reporta indicadores de deuda sin bloquear la Fase 0.

## Estado inicial

| Indicador | Valor inicial |
|---|---:|
| Archivos CSS de componentes | 49 |
| Archivos CSS totales en `src` | 61 |
| Imports en `src/index.css` | 60 |
| Iconos | 55 |
| Custom properties definidas | 124 |
| Colores literales detectados | 75 |
| Valores `px` literales detectados | 401 |
| Bundle sin minificar | 71.6 KB aproximados |
| Bundle minificado | 54.8 KB aproximados |
| Pruebas unitarias | 0 |
| Pruebas de navegador | 0 |
| Pruebas automatizadas de accesibilidad | 0 |
| Componentes `stable` | 0 |

## Fallos conocidos iniciales

- Fuente DTCG única y artefactos CSS/Tailwind generados: F2-001.
- F3-002 añade pruebas de comportamiento para overlays; faltan axe, matriz de
  navegador y regresión visual para el resto de componentes en Fase 4.

## Estado actual

- Fuente DTCG unica, temas y artefactos CSS/Tailwind generados: completado en
  Fase 2.
- Primitivas accesibles para overlays, disclosures, tabs, combobox, grid y toast:
  completado en Fase 3.
- Matriz integral de calidad (axe, Playwright en Chromium/Firefox/WebKit,
  regresion visual, temas y RTL): completado en Fase 4.
- El baseline ya no arrastra deuda estructural de esas fases; reporta solo
  riesgos vivos del programa, principalmente el piloto real de Fase 7 y trabajo
  continuo de adopcion/documentacion.

## Gates incorporados en Fase 1

- Stylelint para sintaxis y errores CSS de alto valor.
- Build desde `src`, seguido de empaquetado del artefacto real.
- Fixtures consumidoras esbuild y Tailwind instaladas desde el tarball.
- Presupuesto de 64 KiB comprimidos y 272 KiB descomprimidos.
- Auditoria de dependencias de produccion en CI.
- Las fases posteriores ampliaron los gates con primitivas, axe, Playwright,
  referencia generada, ejemplos verificables, releases y controles de seguridad.

Los valores detallados de colores y pixeles literales se obtienen del comando y
serviran como indicadores de migracion, no como metas aisladas.
