# RoUI — Resumen ejecutivo

Fecha: 2026-07-19 · Versión publicada: **1.1.0**

## Qué es

RoUI es un design system reutilizable en CSS con primitivas accesibles sin
dependencias de runtime. Se distribuye como paquete npm (`@robertcastro/roui`) y
por CDN, con tokens, 49 componentes, layouts y controladores de comportamiento.

## Estado del programa

Ejecutado por fases con Definition of Done, gates automatizados y auditoría humana
por cierre.

| Fase | Estado | Resultado clave |
|---|---|---|
| 0. Sistema de ejecución | done | Roadmap, DoD, baseline y CI mínima |
| 1. Fundamentos y empaquetado | done | Bundle por capas, exports, fixtures consumidoras |
| 2. Tokens y temas | done | Fuente única DTCG, temas light/dark/high-contrast, contraste AA |
| 3. Primitivas accesibles | done | 6 primitivas ESM (overlay, disclosure, tabs, combobox, grid, toast) con contratos ARIA |
| 4. Pruebas integrales | done | axe, Playwright (96 pruebas en 3 motores), regresión visual, matriz |
| 5. Documentación como producto | done | Referencia por componente, contratos, migración, búsqueda, changelog |
| 6. Releases y gobernanza | done | 1.1.0 publicado con provenance; Changesets, CodeQL, SBOM, Dependabot, gobernanza |
| 7. Adopción multi-proyecto | 90% | Guía de arranque, starters (vanilla/React/Vue), codemod y plantillas de métricas/soporte |

## Logros

- **Publicado y verificable**: `@robertcastro/roui@1.1.0` en npm con provenance
  (OIDC), versionado con Changesets y CHANGELOG automatizado.
- **Accesibilidad de primera clase**: estados dirigidos por semántica ARIA;
  contratos de teclado y foco por patrón; 6 primitivas verificables.
- **Calidad como gate**: `npm run validate` cubre tokens, contraste, literales,
  lint, baseline, 35 pruebas Node, tarball, ejemplos, axe (26 páginas) y
  presupuesto; 96 pruebas de navegador en Chromium/Firefox/WebKit; regresión
  visual.
- **Cadena de suministro mínima**: 0 dependencias de runtime (SBOM de producción
  sin componentes de terceros); CodeQL, dependency-review y Dependabot activos.
- **Documentación como producto**: referencia por componente generada desde
  manifiesto, contratos de accesibilidad renderizados, guía de migración,
  búsqueda y changelog navegable.
- **Vía de adopción**: guía de arranque, starters sin build (vanilla, React, Vue)
  verificados desde el CDN, y codemod de migración de patrones.

## Métricas

- Componentes: **49** (todos `experimental`); documentados en la referencia: **9**.
- Primitivas accesibles: **6**.
- Pruebas: **35** Node + **96** navegador; axe sobre **26** páginas.
- Presupuesto de paquete respetado; dev-deps no entran al tarball.

## Depende del mantenedor

- **Piloto real**: elegir un producto que adopte RoUI (desbloquea la ejecución de
  telemetría y soporte, y el cierre de Fase 7).
- **Protección de rama `main`** (documentada en `governance/branch-protection.md`).
- **PRs de Dependabot** abiertas (#34-#39) por revisar.

## Trabajo continuo

- Documentar los **40 manifiestos** de referencia restantes (infraestructura
  lista).
- Tematizar las demos (`--ro-text` en vez de `--ro-ink` crudo).
- Responsividad de plantillas (RTL/reflow a 320 px).
- Documentación multi-versión.

## Conclusión

El sistema está **publicado, accesible, probado, documentado y gobernado**, con la
vía de adopción preparada. Lo que resta para cerrar Fase 7 depende de una decisión
de producto (el piloto), no de trabajo técnico pendiente.
