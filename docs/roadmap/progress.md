# Estado del programa

Ultima actualizacion: 2026-08-02

## Fases

| Fase                     | Estado      | Progreso | Condicion siguiente                                               |
| ------------------------ | ----------- | -------: | ----------------------------------------------------------------- |
| 0. Sistema de ejecucion  | done        |     100% | Cerrada y aprobada                                                |
| 1. Fundamentos           | done        |     100% | Cerrada y aprobada                                                |
| 2. Tokens y temas        | done        |     100% | Cerrada y aprobada                                                |
| 3. Primitivas accesibles | done        |     100% | Cerrada y aprobada (phase-3-audit)                                |
| 4. Pruebas integrales    | done        |     100% | Cerrada y aprobada (phase-4-audit); PR #19 en main                |
| 5. Documentacion         | done        |     100% | Cerrada y aprobada (phase-5-audit)                                |
| 6. Releases y gobernanza | done        |     100% | Cerrada y aprobada (phase-6-audit); 1.1.0 publicado               |
| 7. Adopcion              | in-progress |      92% | Piloto local listo; cierre depende de producto real en produccion |

## Entregables de Fase 0

| ID     | Entregable                                 | Estado   |
| ------ | ------------------------------------------ | -------- |
| F0-001 | Manual operativo para agentes              | verified |
| F0-002 | Vision y principios                        | verified |
| F0-003 | Arquitectura objetivo                      | verified |
| F0-004 | Roadmap, fase activa y control de progreso | verified |
| F0-005 | Definition of Done y estrategia de pruebas | verified |
| F0-006 | ADR de tokens y paquetes                   | accepted |
| F0-007 | Inventario de componentes y madurez        | verified |
| F0-008 | Matriz de soporte                          | verified |
| F0-009 | Baseline automatizado                      | verified |
| F0-010 | CI minima de pull requests                 | verified |
| F0-011 | Backlog detallado de Fase 1                | verified |

## Riesgos activos

- Fase 7 no puede cerrarse sin un producto real en produccion que adopte RoUI; la
  instrumentacion de metricas y el ciclo de feedback dependen de esa decision.
- Queda trabajo continuo de adopcion: tematizar demos, mejorar reflow/RTL de
  plantillas y preparar documentacion multi-version. (F5-006 completo: los 40
  manifiestos restantes ya estan documentados, referencia en 49/49.)
- Aplicar la proteccion de rama `main` y revisar PRs de Dependabot (#34-#39)
  dependen del mantenedor.
- El presupuesto de paquete: 61 936 / 65 536 bytes comprimidos y
  287 082 / 294 912 bytes descomprimidos (~7.6 KiB de margen, tras F0-020;
  `limits.unpacked` subio de 272KB a 288KB en F0-017 con justificacion
  documentada). Nuevos entrypoints deben reducir contenido o justificar el
  incremento.
- Backlog detallado de Fase 1 (F0-011) cerrado por completo: los 17 items
  quedan `completed` tras F0-020. Trabajo de adopcion continuo (Fase 7)
  sigue abierto por separado — ver fila de Fase 7 en la tabla de arriba.

## Evidencia de la última ejecución

- `npm run validate` correcto el 2026-08-01: tokens, contraste, 0 literales de
  color (39→0, F2-006), build, lint, baseline, 35 pruebas Node, tarball,
  fixtures consumidoras, referencia (49/49), ejemplos, axe sobre 68 paginas y
  presupuesto.
- F2-006 (backlog, 2026-08-01): migracion completa de literales de color (39→0)
  via 21 tokens de alfa nuevos; se corrigio de paso un ENOENT latente en
  build-tokens.mjs y se publica `dist/tokens.json` compacto en vez de la fuente
  legible, recuperando margen de presupuesto.
- F0-012 (backlog #15, 2026-08-01): guia de composicion de layouts reescrita
  (`docs/layouts.html`), seccion Container con limites visibles y variantes
  `--narrow/--wide/--fluid`, y `.ro-layout-rail` (patron main+1 sidebar que no
  existia) con su plantilla `docs/templates/sidebar.html`.
- F0-013 (2026-08-01): 3 plantillas standalone pedian a Google Fonts un
  subconjunto de pesos incompleto (faltaba Inter 300 y JetBrains Mono 400),
  causando sustitucion visual de peso; corregido alineando el `<link>` al
  mismo conjunto completo usado en el resto del sitio.
- F0-014 (2026-08-01): bug mas severo detectado tras F0-013 — las mismas 3
  plantillas standalone (`dashboard.html`, `module-3col.html`,
  `sidebar.html`) nunca importaban `reset.css`, por lo que `.ro-root` nunca
  recibia `font-family: var(--ro-font-sans)` (herencia real: fuente por
  defecto del navegador, ej. Times) ni el resto del reset (`box-sizing`,
  `:focus-visible`, `prefers-reduced-motion`). Causa raiz: decision de
  arquitectura deliberada de no incluir reset global en el bundle
  (`src/index.css`), correctamente documentada para consumidores reales en
  `getting-started.md`, pero nunca aplicada por las propias plantillas del
  sitio de docs. Corregido agregando el `<link>` a `src/base/reset.css` en
  las 3 paginas. Verificado en vivo (CSSOM, `getComputedStyle`, captura) y
  via `npm run validate` (0 fallos, presupuesto sin cambios).
- F0-015 (2026-08-01): bug funcional detectado en revision del usuario sobre
  `docs/layouts.html` — `.ro-burger` en las 3 plantillas standalone era
  visible en movil (bajo 768px) pero sin comportamiento; en ese mismo rango
  `.ro-header__nav` y (en sidebar/module-3col) `.ro-rail--left` se ocultan
  via CSS, dejando el sitio sin navegacion alcanzable. Corregido conectando
  el burger a un drawer real via `overlay-controller` (mismo contrato que
  Modal), con el contenido de nav principal + rail izquierdo segun cada
  plantilla. Verificado en vivo (apertura/cierre, foco, `aria-expanded`) y
  via `npm run validate` (0 fallos, presupuesto sin cambios). Documentado el
  patron rail+drawer en `docs/layouts.html` en un cambio posterior (ver mas
  abajo, tras F0-016).
- F0-016 (2026-08-01): dos bugs visuales reales senalados por el usuario en
  `sidebar.html` — (1) `.ro-nav-item:hover` tenia mas especificidad que
  `.ro-nav-item--active`, dejando texto blanco sobre fondo casi blanco al
  pasar el cursor sobre el item activo; (2) anillo de foco de dos colores
  (borde amarillo `--ro-accent` + resplandor morado `--ro-focus-ring`) en
  `.ro-field`/`.ro-input-box`/`.ro-textarea`/`.ro-select-box`. La
  investigacion del segundo bug expuso un problema de arquitectura mas
  amplio en el paquete publicado: `themes.css` cargaba antes que
  `components.css` en `src/index.css`, por lo que ningun override de tema
  sobre un token base definido en `components.css` podia aplicarse nunca
  (confirmado que esto ya afectaba, sin reportarse, a
  `--ro-button-primary-fg`). Corregido el orden de import y alineados los
  tokens de foco por tema. Verificado en vivo (computed styles en tema base,
  dark y high-contrast) y via `npm run validate` (0 fallos). Un tercer bug
  aparecio tras este fix: el usuario reporto que el borde del input seguia
  visible. Se confirmo un doble outline (el anillo propio de `.ro-field` mas
  un contorno rectangular de `reset.css`) causado porque `reset.css` nunca
  estuvo envuelto en `@layer` — al ser CSS sin capa, gana siempre sobre
  `outline: none` de cualquier componente con anillo de foco propio (12
  selectores), rompiendo el uso documentado en `getting-started.md` para
  cualquier consumidor real, no solo estas plantillas. Corregido envolviendo
  `reset.css` en `@layer roui.reset`. Verificado con foco real (clic + Tab,
  no `.focus()` por script): el doble outline desaparece y el reset sigue
  aplicando su outline por defecto donde no hay anillo custom. Presupuesto
  final: 278009/278528 (~519 bytes de margen, a vigilar).
- `@robertcastro/roui@1.1.0` esta publicado con provenance; Fases 0-6 cerradas
  y aprobadas con auditorias `phase-0-audit` a `phase-6-audit`.
- Primitivas publicas actuales: `overlay-controller`, `disclosure-controller`,
  `tabs-controller`, `combobox-controller`, `grid-controller` y
  `toast-controller`.
- Fase 4 incorporo matriz integral: axe, Playwright en Chromium/Firefox/WebKit
  (96 pruebas), regresion visual, temas y RTL.
- Fase 5 incorporo documentacion como producto: referencia generada,
  contratos de accesibilidad, migracion, ejemplos verificables, busqueda y
  changelog.
- F5-006 (2026-07-20, trabajo continuo): referencia completa en 49/49
  componentes. Nuevo contrato `content-and-status.md` para patrones sin
  primitiva JS (contenido, estructura, estado/datos); 127 snippets verificados
  contra clases/iconos reales; corregido un gap real de CSS
  (`.ro-calendar__pad` sin regla propia).
- Fase 6 incorporo releases y gobernanza: Changesets, publicacion npm,
  provenance, CodeQL, SBOM, dependency-review, Dependabot, CODEOWNERS,
  CONTRIBUTING, SECURITY y SUPPORT.
- Fase 7 esta en `in-progress` al 92%: guia de arranque, starters vanilla/React/Vue,
  piloto local `examples/pilot-dashboard`, codemod `legacy-states`, marco de
  metricas, esquema de telemetria y proceso de soporte/feedback estan listos o
  en `review`. El cierre requiere adopcion en produccion.
- F0-015, siguiente paso cerrado (2026-08-01): el usuario senalo como
  prioridad maxima dejar explicito en `docs/layouts.html` que
  `.ro-layout-rail`/`.ro-layout-3col` ocultan el rail por completo bajo
  768px (no lo apilan) y que un `.ro-burger` sin Drawer conectado es un
  boton inerte. Agregado el bloque "Comportamiento en movil (obligatorio,
  no opcional)" en la seccion "App shell con rail", con enlace al contrato
  `accessibility/dialog-drawer.html`. Verificado con `npm run check:axe`
  (0 violaciones) y `npm run validate` (0 fallos, presupuesto sin cambios).
- F0-017 / backlog #13 (2026-08-01): "Tabla avanzada" — header sortable
  (`.ro-table__sort`, contrato `aria-sort`, sin JS propio), seleccion de
  filas (`.ro-table__select` + `.ro-check` ya existente), sticky header
  (`.ro-table--sticky` + `.ro-table-wrap--scroll`) y estado vacio integrado
  (`.ro-table__empty-cell` envolviendo a `.ro-empty`). La alineacion
  numerica ya estaba resuelta de antes. Detectada y corregida una violacion
  real de axe (`landmark-unique`, 3 ejemplos con el mismo aria-label) y un
  falso positivo de baseline (`--ro-table-scroll-max` sin definir, resuelto
  dandole un valor por defecto en su propia regla). Presupuesto de paquete
  no alcanzaba (~1.9 KB por encima del margen de 519 bytes que quedaba);
  consultado el usuario, se subio `limits.unpacked` en
  `check-package-size.mjs` de 272KB a 288KB con justificacion documentada
  en `docs/tasks/F0-017-tabla-avanzada.md` (la gobernanza de Fase 2 preve
  este caso: "reducir contenido o justificar una modificacion del
  presupuesto"). Verificado con `npm run check:examples` (130 snippets),
  `npm run check:axe` (68/68) y `npm run validate` (0 fallos). Presupuesto
  final: 60436/65536 comprimidos, 280455/294912 descomprimidos.
- F0-018 / backlog #15 cerrado (2026-08-01): `.ro-section`/`.ro-section--sm`
  (ritmo vertical), `.ro-page-header`/`.ro-page-header__actions` y
  `.ro-aspect-video`/`.ro-aspect-square`/`.ro-aspect`. Container sizes ya
  estaba resuelto por F0-012. Dos bugs reales de la demo en
  `docs/layouts.html` detectados y corregidos durante la verificacion (no
  del CSS shippeado): las cajas de aspect-ratio median una proporcion
  incorrecta por el padding de `.dx-box` restando del alto calculado
  (corregido con `padding:0`); la demo de `.ro-section` no mostraba ningun
  efecto porque `.dx-box`'s `padding:16px` (CSS sin capa en el propio
  `layouts.html`) le ganaba incondicionalmente a `.ro-section`'s
  `padding-block` (capa `roui.layouts`) — mismo patron de bug que el doble
  outline de F0-016, corregido reemplazando la demo por el lenguaje visual
  de `.dx-bleed` ya usado en Container. Verificado con medidas reales
  (`getBoundingClientRect`/`getComputedStyle`): ratios 16/9, 1/1 y 4/3
  exactos; padding-top 32px/24px segun variante. `npm run check:axe` y
  `npm run validate`: 0 fallos. Presupuesto: 61005/65536 comprimidos,
  282751/294912 descomprimidos (~12.16 KiB de margen).
- F0-019 / backlog #16 cerrado (2026-08-01): sombras `--ro-shadow-lg`/`--xl`
  agregadas a la escala (antes solo sm/md, y 8 componentes distintos
  compartian el mismo md sin jerarquia); reasignados Modal y Command Palette
  a xl, Drawer a lg (Popover/Menu/Tooltip/Toast/Combobox se quedan en md).
  Modo densidad nuevo: `--ro-btn-py/px`, `--ro-input-py/px`,
  `--ro-table-cell-py/px` con valor base identico al padding hardcodeado
  previo (sin cambio visual por defecto) y overrides
  `[data-ro-density="compact"/"comfortable"]` (mismo patron arquitectonico
  que `[data-ro-theme]`, construido sobre el fix de orden de import de
  F0-016). Conectado a 3 componentes reales: Button, Input (box + group),
  Table. `.ro-btn--sm/--lg` fijan su propio padding y no responden a
  densidad, por diseno. Primera migracion real de la prioridad 1 de
  `literal-policy.md`: 386 → 382 px literales (tokenizacion de 4 paddings
  hardcodeados). Verificado con `getComputedStyle` en vivo (padding exacto
  por nivel de densidad, sin regresion en el valor base) y
  `npm run validate` (0 fallos). Presupuesto: 61874/65536 comprimidos,
  286412/294912 descomprimidos (~8.3 KiB de margen).
- F0-020 / backlog #17 cerrado (2026-08-01), **ultimo item del backlog
  detallado de Fase 1 — los 17 quedan `completed`**. Se confirmo que
  stylelint y CHANGELOG.md (via Changesets) ya existian y funcionaban; se
  agrego Prettier (`.prettierrc.json`, `.prettierignore`, scripts
  `format`/`check:format`, este ultimo ahora parte de `npm run validate`).
  CSS y HTML quedan fuera del alcance de Prettier por decision consultada
  con el usuario: el formato por defecto de Prettier en CSS (una propiedad
  por linea) media +4.6% en las fuentes y arriesgaba el presupuesto de
  paquete de nuevo; en HTML auto-cierra void elements y corta elementos
  inline de forma invasiva sobre markup de demo escrito a mano. Se
  reformatearon 125 archivos `.md`/`.mjs`/`.js` dentro de alcance. Se
  agregaron 3 secciones nuevas a `getting-started.md`: Densidad, RTL (deja
  explicito que lo probado es "sin scroll horizontal", no mirroring visual
  garantizado) y Accesibilidad (mapa de los 6 contratos publicados).
  Verificado con `npm run check:axe` (68/68) y `npm run validate` (0
  fallos, incluye el nuevo `check:format`). Presupuesto: 61936/65536
  comprimidos, 287082/294912 descomprimidos (~7.6 KiB de margen).
