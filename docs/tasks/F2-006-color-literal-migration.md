# F2-006: Migración completa de literales de color (39 → 0)

- Estado: review
- Fase: 2 (trabajo continuo, ejecutado durante Fase 7)
- Dependencias: F2-005 (baseline de literales)
- ADR relacionados: ADR-0001, ADR-0006

## Objetivo

Reducir a cero el inventario de colores literales fuera de tokens (39 → 0),
manteniendo fidelidad visual exacta y sin exceder el presupuesto de paquete.

## Contexto

`check:literals` congelaba 39 colores y 382 px como baseline (F2-005), sin
clasificar cuáles eran deuda real. Se auditó el inventario completo: casi todos
los colores eran variantes de alfa de tokens que ya existían en forma opaca
(`ink`, `on-dark`, `primary`, `secondary`, `info`, `success`, `warning`, `error`)
pero sin ese alfa concreto generado.

## Alcance

- Incluido: 21 tokens de color nuevos en `tokens/tokens.json`; migración de los
  39 literales en 16 archivos CSS a `var(--ro-*)`; dos `rgba(0,0,0,0)` a la
  palabra clave `transparent`; dos `#fff` a `var(--ro-white)`; un ajuste de
  consistencia deliberado (ver Notas); actualización del hash-lock de
  `check:literals` y de la política documentada.
- Excluido: migración de los 382 valores px (frente siguiente, ver
  `literal-policy.md`); promoción de madurez de componentes.

## Tokens nuevos

`--ro-ink-{14,25,28,30,45}`, `--ro-on-dark-{06,10,18,20,30}`,
`--ro-primary-{13,40}`, `--ro-secondary-40`,
`--ro-{info,success,warning,error}-{08,30}` según el color semántico
correspondiente (info/success usan 08+30; warning usa 10+35; error usa 08+30).

## Archivos migrados

alert.css, badge.css, button-group.css, card.css, code.css,
command-palette.css, drawer.css, header.css, menu.css, modal.css, progress.css,
skeleton.css, slider.css, spinner.css, tags-input.css, layouts/three-col.css.

## Efecto colateral: presupuesto de paquete

El presupuesto ya estaba al límite (~2.4 KiB de margen) antes de esta tarea. Los
21 tokens nuevos en `tokens/tokens.json` (formato DTCG legible, ~90 bytes por
entrada) empujaron el paquete **por encima** del límite: 280426/278528 bytes
(+1898). Se corrigió con una mejora estructural, no cosmética: `tokens.json` se
publicaba tal cual (pretty-printed) en el tarball; ahora `build-tokens.mjs`
genera además `dist/tokens.json` (mismo contenido, compactado — 15953→11272
bytes, -4681), `package.json` apunta `exports["./tokens.json"]` a ese archivo y
excluye `tokens/tokens.json` del `files` (mismo patrón que las exclusiones ya
existentes de `src/primitives` y `src/icons/icons.json`). Resultado neto:
**275770/278528 — mejor margen que antes de empezar** (276048). Se corrigió
también el ENOENT latente: `build-tokens.mjs` corre antes que `build.mjs` cree
`dist/`, así que se le añadió su propio `mkdirSync`.

## Notas — cambio de diseño deliberado

`src/layouts/three-col.css` (bordes del rail) usaba `rgba(0,0,0,0.08)` (negro
puro) en vez del token de borde hairline que usa el resto del sistema
(`--ro-ink-10` = `rgba(23,23,25,0.10)`). Es una inconsistencia, no una decisión
de marca: todo lo demás en RoUI usa translucidez de `ink`, no negro puro. Se
migró a `--ro-ink-10`. Diferencia perceptual: imperceptible (mismo alfa
aproximado, tinte casi idéntico); documentado explícitamente porque es un
cambio de valor renderizado, no una migración 1:1.

## Criterios de aceptacion

- [x] `check:literals` reporta 0 colores (era 39); 382 px sin cambios.
- [x] Los 39 sitios de uso verificados con fidelidad exacta (computed style en
  navegador coincide con el rgba original, salvo el ajuste documentado).
- [x] `npm run validate` verde dentro del presupuesto (con margen mejorado).
- [x] Política y hash-lock actualizados con justificación completa.

## Plan de validacion

```bash
npm run check:literals
npm run validate
git diff --check
```

## Cierre

- Resultado: 0 colores literales fuera de tokens; presupuesto de paquete con
  mejor margen que al empezar, vía una mejora estructural reutilizable
  (`dist/tokens.json` compacto) que también beneficia futuras adiciones de
  tokens.
- Archivos: `tokens/tokens.json` (21 tokens), `src/tokens/colors.css`
  (regenerado), `scripts/build-tokens.mjs` (nuevo output + mkdirSync),
  `scripts/check-literals.mjs` (digest actualizado), `package.json`
  (export + exclusión de `tokens/tokens.json`), 16 archivos CSS migrados,
  `docs/quality/literal-policy.md` (documentación completa de la migración).
- Comandos: `npm run check:literals`, `npm run build`, `npm run validate`,
  `git diff --check`.
- Riesgos pendientes: 382 valores px por clasificar/migrar (frente siguiente,
  prioridad documentada en `literal-policy.md`); margen de presupuesto sigue
  siendo un recurso finito a vigilar en cada PR.
