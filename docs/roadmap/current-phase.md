# Fase activa: 4 — Sistema integral de pruebas

## Objetivo

Convertir la calidad visual, funcional y accesible en gates obligatorios,
verificables de forma automatizada sobre las primitivas y componentes ya
publicados.

## Estado de entrada

Fase 3 cerrada y aprobada (ver `phase-3-audit.md`): seis primitivas accesibles
(`overlay`, `disclosure`, `tabs`, `combobox`, `grid`, `toast`) con contratos ARIA,
teclado y foco, 30 pruebas de comportamiento verdes y verificación manual del
usuario. Integración de F3-004/005/006 a `main` pendiente como paso mecánico.

## Trabajo permitido

- axe automatizado sobre demos y fixtures (roles, nombres, contraste).
- Pruebas de navegador (Playwright) para foco, teclado y overlays.
- Regresión visual de componentes y plantillas.
- Matriz de navegadores, RTL, temas, zoom y tamaños.
- Presupuestos de bundle como gate ya existente; endurecer y documentar.

## Fuera de alcance

- Añadir componentes o primitivas nuevas sin necesidad de pruebas.
- Documentación de producto (Fase 5) y adopción multi-proyecto (Fase 7).

## Orden inicial

1. F4-001: axe automatizado sobre la galería y fixtures. (review)
2. F4-002: Playwright para Dialog, Drawer y Command Palette (foco y Escape). (review)
3. F4-003: navegación de teclado de Tabs, Combobox y Calendar en navegador. (review)
4. F4-004: regresión visual de componentes y plantillas.
5. F4-005: matriz de navegadores, temas, RTL y zoom.

## Condiciones de salida

- axe, Playwright y regresión visual corren en CI como gates obligatorios.
- La matriz de navegadores/temas/RTL/zoom cubre los componentes estables.
- Las primitivas de Fase 3 quedan cubiertas por pruebas de navegador.
- Auditoría humana aprueba el cierre de Fase 4.
