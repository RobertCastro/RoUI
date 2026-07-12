# Fase activa: 3 — Primitivas accesibles

## Objetivo

Convertir los componentes visuales en contratos de interacción completos,
accesibles por teclado y utilizables desde distintos stacks frontend.

## Trabajo permitido

- Definir semántica HTML, ARIA, estados y teclado por componente.
- Mejorar controles nativos antes de implementar patrones compuestos.
- Crear primitivas de Dialog, Menu, Tabs, Popover, Combobox y Drawer.
- Documentar gestión de foco, portales, scroll y anuncios dinámicos.
- Añadir pruebas de comportamiento proporcionales; la matriz integral llega en
  Fase 4.

## Fuera de alcance

- Añadir componentes visuales sin contrato de accesibilidad.
- Crear adaptadores para todos los frameworks simultáneamente.
- Declarar componentes `stable` sin pruebas de teclado y lector de pantalla.

## Orden inicial

1. F3-001: contratos para Button y Form nativos.
2. F3-002: Dialog y Drawer con foco, Escape y restauración.
3. F3-003: Menu, Popover y Tooltip.
4. F3-004: Tabs, Accordion y navegación.
5. F3-005: Combobox, Calendar y Command Palette.

## Condiciones de salida

- Cada componente estable define roles, teclado, foco y estados.
- Los patrones complejos tienen primitivas o controladores verificables.
- Las pruebas de comportamiento y accesibilidad requeridas están verdes.
- Auditoría humana aprueba el cierre de Fase 3.
