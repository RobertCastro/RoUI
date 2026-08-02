---
"@robertcastro/roui": patch
---

Corrige tres bugs reales del paquete publicado: `.ro-nav-item:hover` tenía más especificidad que `.ro-nav-item--active`, dejando texto ilegible al pasar el cursor sobre el ítem activo; `--ro-control-focus-border` no coincidía en tono con `--ro-focus-ring` (y no cambiaba correctamente por tema, por un orden de import invertido entre `themes.css` y `components.css`); `reset.css` no estaba envuelto en `@layer`, por lo que su `outline` de `:focus-visible` rompía el `outline: none` de cualquier componente con anillo de foco propio (Button, Input, Avatar, Menu, Toast, Slider, …) en cuanto se importaba junto al bundle — el uso documentado en la guía de instalación.
