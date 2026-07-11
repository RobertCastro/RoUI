# Roadmap maestro

El orden es obligatorio salvo que un ADR aprobado lo cambie.

## Fase 0 — Sistema de ejecucion y baseline

Objetivo: hacer persistentes vision, decisiones, calidad, inventario y control
de progreso antes de transformar la arquitectura.

Salidas: manual de agentes, arquitectura, ADR iniciales, Definition of Done,
estrategia de pruebas, matriz de soporte, inventario y baseline automatizado.

## Fase 1 — Fundamentos y empaquetado

Objetivo: distribucion reproducible, granular y segura.

Salidas: estructura de workspace, exports probados, Tailwind corregido, reset
opcional, cascade layers, CI para PR y pruebas de consumidores.

## Fase 2 — Arquitectura de tokens y temas

Objetivo: fuente DTCG unica y theming extensible.

Salidas: generador, esquema, tokens primitivos/semanticos/de componente, light,
dark y high contrast, validacion de valores literales y sincronizacion de Figma.

## Fase 3 — Primitivas accesibles

Objetivo: comportamiento productivo WCAG 2.2 AA.

Orden inicial: Button/Form, Dialog, Popover/Tooltip, Menu, Tabs, Accordion,
Combobox/Listbox, Toast, Drawer, Date Picker y Command Palette.

## Fase 4 — Sistema integral de pruebas

Objetivo: convertir calidad visual, funcional y accesible en gates obligatorios.

Salidas: unitarias, Playwright, axe, regresion visual, matriz de navegadores,
RTL, temas, zoom, tamanos y presupuestos de bundle.

## Fase 5 — Documentacion como producto

Objetivo: referencia contractual, playground y ejemplos verificables.

Salidas: API, teclado, accesibilidad, do/don't, tokens, madurez, busqueda,
versiones, guias de migracion y ejemplos por stack priorizado.

## Fase 6 — Releases, seguridad y gobernanza

Objetivo: publicacion trazable y evolucion predecible.

Salidas: Changesets, canary, provenance npm, SBOM, CodeQL, CODEOWNERS,
protecciones de rama, soporte, vulnerabilidades y deprecaciones.

## Fase 7 — Adopcion multi-proyecto

Objetivo: validar el sistema en productos independientes y medir impacto.

Salidas: pilotos, plantillas, codemods, telemetria de adopcion, soporte y
metricas de velocidad, defectos y migraciones.

