# Baseline tecnico

Fecha: 2026-07-10

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

## Fallos conocidos

- Fuente DTCG única y artefactos CSS/Tailwind generados: F2-001.
- F3-002 añade pruebas de comportamiento para overlays; faltan axe, matriz de
  navegador y regresión visual para el resto de componentes en Fase 4.

## Gates incorporados en Fase 1

- Stylelint para sintaxis y errores CSS de alto valor.
- Build desde `src`, seguido de empaquetado del artefacto real.
- Fixtures consumidoras esbuild y Tailwind instaladas desde el tarball.
- Presupuesto de 64 KiB comprimidos y 272 KiB descomprimidos.
- Auditoria de dependencias de produccion en CI.
- F3-002 entrega un controlador verificable para Dialog y Drawer; los demás
  componentes complejos continúan con comportamiento de demo hasta su tarea.

Los valores detallados de colores y pixeles literales se obtienen del comando y
serviran como indicadores de migracion, no como metas aisladas.
