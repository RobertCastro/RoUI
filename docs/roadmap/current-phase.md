# Fase activa: 5 — Documentacion como producto

## Objetivo

Convertir la referencia del sistema en un producto usable: contrato por
componente, ejemplos verificables y guias que permitan adoptar RoUI sin leer el
codigo fuente.

## Estado de entrada

Fase 4 cerrada y aprobada (ver `phase-4-audit.md`, PR #19 en `main`): gates de
accesibilidad (axe), comportamiento en navegador (Playwright, 96 pruebas en tres
motores), regresion visual y matriz de temas/RTL. Seis primitivas accesibles con
contratos ARIA, teclado y foco.

## Trabajo permitido

- Referencia de API por componente y primitiva (props, data-attributes, eventos).
- Documentar teclado, foco, roles y anuncios por patron.
- Do/don't, estados y madurez por componente.
- Ejemplos verificables por stack priorizado y guias de migracion.
- Busqueda y navegacion por versiones en el sitio de docs.

## Fuera de alcance

- Nuevas primitivas o componentes sin necesidad documental.
- Adopcion multi-proyecto (Fase 7) y releases formales (Fase 6).

## Orden inicial

1. F5-001: estructura de la referencia y plantilla de pagina por componente. (review)
2. F5-002: contratos de accesibilidad y teclado enlazados desde cada componente. (review)
3. F5-003: ejemplos verificables (copiar/pegar) por componente. (review)
4. F5-004: madurez, do/don't y guias de migracion. (review)
5. F5-005: busqueda y navegacion por versiones.

## Condiciones de salida

- Cada componente estable tiene referencia de API, teclado y ejemplos.
- Los ejemplos se verifican automaticamente (no divergen del codigo).
- La documentacion enlaza los contratos de accesibilidad existentes.
- Auditoria humana aprueba el cierre de Fase 5.

## Tareas de seguimiento heredadas

- Tematizacion de las demos (usar `--ro-text` en vez de `--ro-ink` crudo).
- Responsividad de plantillas: RTL/reflow a 320 px (dashboard, `<pre>`).
