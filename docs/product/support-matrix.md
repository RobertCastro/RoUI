# Matriz de soporte inicial

Esta matriz es la direccion de soporte. Las versiones exactas se fijaran y se
automatizaran durante Fase 1.

| Superficie | Objetivo | Estado actual |
|---|---|---|
| Node para tooling | LTS activa y mantenimiento | Node 20 en workflows |
| Chromium | Dos versiones estables recientes | Sin pruebas |
| Firefox | Dos versiones estables recientes | Sin pruebas |
| WebKit/Safari | Dos versiones estables recientes | Sin pruebas |
| Movil | iOS Safari y Chrome Android recientes | Demo responsive manual |
| HTML/CSS vanilla | Soporte de primera clase | Bundle disponible |
| Tailwind | Integracion versionada | Preset actual incompatible con contrato documentado |
| React/Next | Adaptador prioritario futuro | No implementado |
| Vue/Svelte/Angular | Segun demanda validada | No implementado |
| SSR | Sin errores de importacion o hidratacion | No evaluado |
| RTL | Componentes estables | No evaluado |
| Localizacion | Contenido largo y formatos locales | No evaluado |
| Accesibilidad | WCAG 2.2 AA | Parcial, sin auditoria completa |
| Temas | Light, dark y high contrast | Solo light/base |

## Politica

- Una superficie pasa a `supported` solo cuando tiene fixture, CI y responsable.
- Lo no probado se considera experimental, aunque visualmente funcione.
- La matriz se revisa en cada version mayor y cuando cambia una dependencia base.

