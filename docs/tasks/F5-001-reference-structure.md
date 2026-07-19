# F5-001: Estructura de referencia y plantilla por componente

- Estado: done
- Fase: 5
- Dependencias: F4 (gates), inventario de componentes
- ADR relacionados: ADR-0005

## Objetivo

Definir una pagina de referencia repetible por componente y la estructura del
sitio de documentacion, generadas desde una fuente unica, para poder documentar
los 49 componentes de forma consistente y sin divergir del codigo.

## Contexto

La galeria (`components.html`) muestra los componentes, pero no hay referencia por
componente con API, teclado y ejemplos. Documentar 49 a mano divergiria; se opta
por un generador desde manifiesto (decision del usuario).

## Alcance

- Incluido: esquema de manifiesto por componente
  (`docs/reference/components/<name>.json`); generador `scripts/build-reference.mjs`
  (con modo `--check` anti-drift); plantilla de pagina (7 secciones); indice
  agrupado por familia con badges de madurez y estado documentado/pendiente;
  estilos `dx-ref-*`; enlace "Referencia" en el nav del sitio; manifiesto ejemplar
  de Button; gates (`check:reference`, axe sobre las paginas generadas).
- Excluido: rellenar los 48 manifiestos restantes (F5-002/003/004); ejemplos
  ejecutables verificados en navegador (F5-003); busqueda y versiones (F5-005).

## Plantilla de pagina

Cabecera (familia, titulo, badge de madurez, resumen) → Cuando usarlo / no →
Anatomia (HTML anotado) → API (clases, `data-*`, tokens, primitiva) → Teclado y
accesibilidad (tabla + enlace al contrato) → Ejemplos (demo viva + codigo) →
Do/Don't → Relacionados.

## Progreso

- [x] Generador con validacion de esquema y modo `--check`.
- [x] Plantilla y estilos `dx-ref-*`.
- [x] Indice por familia (10 grupos) con estado documentado/pendiente.
- [x] Manifiesto de Button y pagina generada.
- [x] `check:reference` y las paginas generadas en el gate axe; nav enlazado.

## Criterios de aceptacion

- [x] El manifiesto se valida (campos y madurez) y falla si es invalido.
- [x] `build:reference` genera `docs/reference/*.html`; `check:reference` detecta
  drift en `validate`.
- [x] La pagina de Button y el indice pasan axe y renderizan las demos vivas.
- [x] La referencia es alcanzable desde el nav del sitio.
- [x] `npm run validate` y `git diff --check` verdes.

## Plan de validacion

```bash
npm run build:reference
npm run check:reference
npm run validate
git diff --check
```

## Cierre

- Resultado: generador de referencia desde manifiesto, plantilla de 7 secciones,
  indice por familia y la primera pagina (Button) verificada visual y por axe.
- Archivos: `scripts/build-reference.mjs`, `docs/reference/components/button.json`,
  `docs/reference/{button,index}.html` (generados), `docs/assets/docs.css`
  (estilos `dx-ref-*`), `scripts/check-axe.mjs` (incluye reference),
  `package.json` (`build:reference`, `check:reference`, `validate`), nav de las 5
  paginas de docs, `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run build:reference`, `npm run validate`, `git diff --check`.
- Riesgos pendientes: 48 componentes sin manifiesto (visibles como "pendiente" en
  el indice); enlaces a contratos apuntan a `.md` hasta integrarlos en F5-002.
- Siguiente tarea desbloqueada: F5-002 (contratos de accesibilidad enlazados y
  primeros lotes de manifiestos).
