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

- Preset Tailwind incompatible con el contrato `require()` documentado.
- Fuentes de tokens duplicadas entre CSS, JSON y Tailwind.
- Reset y foco globales afectan elementos externos al sistema.
- No existen pruebas de comportamiento, axe o regresion visual.
- Los componentes interactivos complejos solo tienen comportamiento de demo.

Los valores detallados de colores y pixeles literales se obtienen del comando y
serviran como indicadores de migracion, no como metas aisladas.
