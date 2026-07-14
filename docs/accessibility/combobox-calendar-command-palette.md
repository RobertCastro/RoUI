# Combobox, Calendar y Command Palette accesibles

Tres patrones de entrada asistida. El marcado conserva roles y relaciones; los
controladores gestionan estado, opción activa y teclado sin robar el foco del
campo de texto.

## Combobox

Un `input role="combobox"` controla un `role="listbox"` de opciones
`role="option"`. La opción resaltada se comunica con `aria-activedescendant`
(el foco permanece en el input), no moviendo el foco.

```html
<div class="ro-combobox" data-ro-combobox>
  <div class="ro-field">
    <input class="ro-input" id="cb" role="combobox" aria-expanded="false"
      aria-controls="cb-list" aria-autocomplete="list" aria-label="Busca un lenguaje">
  </div>
  <div class="ro-combobox__list" id="cb-list" role="listbox" aria-label="Lenguajes">
    <div class="ro-combobox__option" role="option">JavaScript</div>
    <div class="ro-combobox__option" role="option">TypeScript</div>
    <div class="ro-combobox__empty" hidden>Sin coincidencias</div>
  </div>
</div>
```

```js
import { createComboboxController } from "@robertcastro/roui/primitives/combobox-controller";

createComboboxController(root, { onFilter: (query) => { /* oculta opciones */ } });
```

`ArrowDown`/`ArrowUp` recorren (con wrap), `Home`/`End` van a los extremos,
`Enter` selecciona la opción activa y rellena el input, `Escape` cierra y un
`pointerdown` exterior también. Al escribir se llama a `onFilter`; si la opción
activa deja de ser visible se limpia. El `data-value` de una opción sobreescribe
su texto como valor.

## Command Palette

Es un combobox **en línea** dentro de un `role="dialog"` modal. El diálogo lo
gestiona `overlay-controller` (foco inicial en el campo, trap de `Tab`, `Escape`
y restauración del disparador); la lista la gestiona `combobox-controller` con
`inline: true`.

```html
<div class="ro-cmdk-overlay" id="cmdk" data-ro-overlay-root hidden>
  <div class="ro-cmdk" role="dialog" aria-modal="true" aria-label="Paleta de comandos" data-ro-cmdk>
    <div class="ro-cmdk__search">
      <input id="cmdk-input" role="combobox" aria-expanded="true"
        aria-controls="cmdk-list" aria-autocomplete="list" aria-label="Buscar comandos">
    </div>
    <div class="ro-cmdk__list" id="cmdk-list" role="listbox" aria-label="Comandos">
      <div class="ro-cmdk__group" role="presentation">Navegar</div>
      <div class="ro-cmdk__item" role="option">Ir a Inicio <span class="ro-kbd">G</span></div>
    </div>
  </div>
</div>
```

En modo inline la lista está siempre visible: el combobox **no** captura `Escape`
(lo maneja el diálogo) ni cierra por pointer exterior, y `Enter` ejecuta la
acción (`onSelect`) sin rellenar el input. El disparador usa
`data-ro-overlay-open` y `aria-haspopup="dialog"`; un atajo `⌘K`/`Ctrl+K` abre la
paleta. Los encabezados de grupo son `role="presentation"`.

## Calendar / Date Picker

Pendiente en F3-005: cuadrícula `role="grid"` con filas `role="row"` y celdas
`role="gridcell"`; una sola celda es tabbable (roving tabindex), las flechas
mueven por día, `Home`/`End` por semana y `PageUp`/`PageDown` por mes; el día
elegido se marca con `aria-selected`. El date picker lo montará dentro de un
popover con el disclosure persistente.

## Verificación manual

- Combobox: `ArrowDown` abre y resalta sin perder el foco del input; escribir
  filtra; `Enter` selecciona; `Escape` cierra; clic exterior cierra.
- Command Palette y Calendar: se documentarán al completar sus contratos.
