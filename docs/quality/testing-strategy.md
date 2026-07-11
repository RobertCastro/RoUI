# Estrategia de pruebas

## Piramide de calidad

1. Validacion estatica: formato, lint, tipos, tokens y exports.
2. Unitarias: transformaciones y logica aislada.
3. Componentes: estados, eventos, semantica y teclado.
4. Navegador: flujos, foco, portales, responsive y SSR cuando aplique.
5. Accesibilidad: axe automatizado mas pruebas manuales programadas.
6. Regresion visual: navegadores, viewports, temas, RTL y estados.
7. Consumidores: instalacion desde tarball y uso de entrypoints publicos.

## Matriz minima objetivo

- Motores: Chromium, Firefox y WebKit.
- Viewports: movil pequeno, tablet y escritorio.
- Preferencias: light, dark, high contrast y reduced motion.
- Direccion: LTR y RTL.
- Interaccion: teclado, puntero y touch donde aplique.
- Contenido: corto, largo, localizado, vacio y error.

## Gate por tipo de cambio

| Cambio | Validaciones minimas |
|---|---|
| Token | esquema, referencias, snapshots, contraste, outputs |
| CSS visual | lint, visual, responsive, temas |
| Componente interactivo | unit, teclado, axe, navegador, visual |
| Export/paquete | build, npm pack, fixtures consumidoras |
| Documentacion | build, enlaces, snippets ejecutables |
| Breaking change | anteriores + migracion y versionado |

## Regla de evidencia

Una prueba omitida debe justificarse en la tarea. Las verificaciones manuales
deben registrar navegador, viewport, pasos y resultado.

## Implementacion incremental

La seleccion final de herramientas se registrara mediante ADR. La adopcion
prevista evaluara Stylelint, Vitest, Testing Library, Playwright, axe y una
solucion de snapshots visuales compatible con el presupuesto y CI.

