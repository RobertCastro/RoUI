# F3-002: Contrato accesible de Dialog y Drawer

- Estado: review
- Fase: 3
- Dependencias: F3-001
- ADR relacionados: ADR-0002

## Objetivo

Entregar un contrato reutilizable para Dialog modal y Drawer que preserve la
semántica del marcado y añada comportamiento verificable de foco, Escape,
restauración y bloqueo de scroll.

## Contexto

Los estilos existentes abrían overlays solo mediante JavaScript de las demos.
No existía un contrato público ni una fuente de verdad para el foco y el
teclado, por lo que cada consumidor debía reconstruir un comportamiento crítico.

## Alcance

- Incluido: controlador ESM opcional, estilos de reduced motion, marcado y
  ejemplos de documentación, tests de comportamiento y export público.
- Excluido: portal automático, componentes de framework, apilamiento de
  overlays y la matriz de navegador/axe de Fase 4.

## Criterios de aceptación

- [x] Dialog y Drawer documentan el rol, nombre accesible, foco inicial,
  `Escape`, `Tab`, cierre y restauración.
- [x] El controlador público atrapa foco, restaura el disparador y bloquea
  scroll mientras un overlay está abierto.
- [x] Los ejemplos consumen el controlador generado, no una copia para docs.
- [x] Reduced motion elimina las animaciones de apertura.
- [x] Tests verifican foco, teclado, cierre y el entrypoint empaquetado.
- [x] El presupuesto de paquete conserva límite comprimido y registra el coste
  del nuevo entrypoint público.

## Plan de validación

```bash
npm run test:primitives
npm run test:package
npm run validate
git diff --check
```

## Cierre

- Resultado: controlador ESM público para overlays, contrato de marcado y demos
  de Dialog/Drawer que consumen el mismo artefacto generado.
- Archivos modificados: `src/primitives/overlay-controller.js`, estilos de
  modal/drawer, build/export/tests, documentación y demos.
- Comandos ejecutados: `npm run validate`, `git diff --check`; ambos correctos.
- Evidencia manual: Chromium local, `http://localhost:8799/docs/components.html`;
  Dialog y Drawer abren con foco en el cierre, bloquean scroll, responden a
  Escape y restauran el foco al disparador.
- Riesgos pendientes: matriz browser, axe y regresión visual se implementan en Fase 4.
- Decisión de tamaño: se ajusta el límite descomprimido a 272 KiB según
  ADR-0005; el tarball con el controlador mide 271 802 bytes descomprimidos.
- Siguiente tarea desbloqueada: F3-003 Menu, Popover y Tooltip.
