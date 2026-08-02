# Política de valores literales

Los valores de color, espaciado, radio y dimensiones reutilizables deben
provenir de tokens. `npm run check:literals` registra los literales restantes
fuera de `src/tokens/` y bloquea cambios no revisados en su inventario.

Baseline F2-005: 39 literales de color y 382 valores en píxeles, con huella
`2841ae7ba080c264db9145ca926ecb15b7f880aae5874cec728e8b24674ef044`.

**Migración de colores (2026-08-01): 39 → 0.** Se auditaron los 39 literales de
color y se clasificaron: la mayoría eran variantes de alfa de colores que ya
existían como token opaco (`ink`, `on-dark`, `primary`, `secondary` y los cuatro
semánticos `info`/`success`/`warning`/`error`) pero sin ese alfa concreto
generado. Se añadieron 21 tokens nuevos a `tokens/tokens.json`
(`--ro-ink-{14,25,28,30,45}`, `--ro-on-dark-{06,10,18,20,30}`,
`--ro-primary-{13,40}`, `--ro-secondary-40`,
`--ro-{info,success,warning,error}-{08,30}` según el color) y se migró cada sitio
de uso. Dos `rgba(0,0,0,0)` se reemplazaron por la palabra clave `transparent`
(no requieren token). Dos `#fff` pasaron a `var(--ro-white)`. Un caso
(`src/layouts/three-col.css`, bordes del rail) usaba negro puro
(`rgba(0,0,0,0.08)`) en vez del token de borde hairline ya establecido en el
resto del sistema (`--ro-ink-10`); se corrigió por consistencia — cambio de
diseño imperceptible pero deliberado, no una migración de valor-por-valor.
**Layout con rail único (2026-08-01):** se añadió `.ro-layout-rail` (nueva sección
"App shell con rail" en `docs/layouts.html`), que reutiliza el breakpoint
`768px` ya existente en `.ro-layout-3col`/`.ro-rail--left` — una ocurrencia más
del mismo literal ya clasificado como excepción de breakpoint, no deuda nueva.
383 → 384: `.ro-table-wrap--scroll` (F0-017) define `--ro-table-scroll-max: 480px`
como default real dentro de su propia regla (no un fallback de `var()` sin
definir, que baseline rechaza) — un literal geométrico nuevo, sin excepción
previa que lo cubriera. 384 → 386: `.ro-section`/`.ro-section--sm` (F0-018)
reutilizan el breakpoint `1024px` (dos ocurrencias, mismo literal ya aceptado
como excepción de breakpoint en `.ro-container`). **386 → 382: tokens de
densidad (2026-08-01).** Se tokenizaron los paddings fijos de `.ro-btn`
(`0.625rem 1rem`), `.ro-input-box` (`0.625rem 0.875rem`), `.ro-table tbody td`
(`14px 16px`) y el input de `.ro-input-group` (`10px 12px`) a
`--ro-btn-py/px`, `--ro-input-py/px` y `--ro-table-cell-py/px` — primera
migración real de la prioridad 1 de este documento (valores que calzan con
padding/gap). El valor de `.ro-input-group` pasa de `12px` a `14px` de
padding horizontal (mismo token que `.ro-input-box`) — cambio visual menor y
deliberado, no un ajuste por accidente.

Huella actual: `6fbc2b308c92ee4ad3dc60f4cb21ea7e852d90d747d0b8540d6616531267be31`
(0 colores, 382 px).

Excepciones permitidas actualmente:

- Breakpoints dentro de `@media (min-width: ...)` (`320/640/768/1024/1280px`):
  las custom properties de CSS no funcionan dentro de media features en ningún
  navegador; el valor debe ser literal aunque exista el token de breakpoint
  (`--ro-bp-*`) para uso en JS/otros contextos. No cuenta como deuda.
- Bordes finos (`1px`–`3px`) y offsets de `box-shadow`: convención estándar de
  la industria, no se tokenizan.
- Valores internos de gradientes y overlays cuya composición no se expresa aún
  como token.
- Datos SVG embebidos en controles nativos.
- Medidas geométricas locales para iconos, animaciones y pseudo-elementos.
- Valores de compatibilidad de navegadores que no representan una decisión de
  diseño reutilizable.

Cada nueva excepción requiere justificarla en la tarea correspondiente. Las
migraciones deben reducir el inventario; no basta con sustituir un literal por
otro literal equivalente.

Prioridad de migración (píxeles, siguiente frente — colores ya completado):

1. Valores que calzan exacto con la escala de espaciado (`--ro-space-2..8`:
   8/12/16/20/24/28/40px) usados como padding/margin/gap.
2. Medidas de layout repetidas que no pertenezcan a la geometría local.
3. Datos SVG y geometría de pseudo-elementos, solo si existe un consumidor real.
