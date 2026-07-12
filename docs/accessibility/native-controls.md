# Contratos accesibles: Button y Form

## Button

Usa `<button>` para acciones y `<a>` solo para navegación real. Todo botón debe
tener nombre accesible: texto visible o `aria-label` cuando solo contiene icono.

```html
<button class="ro-btn ro-btn--primary" type="button">
  Guardar cambios
</button>

<button class="ro-btn-icon" type="button" aria-label="Cerrar diálogo">
  <svg class="ro-icon" aria-hidden="true"><use href="#ro-i-x"></use></svg>
</button>
```

- `disabled` solo se aplica a controles nativos y evita interacción.
- `aria-busy="true"` comunica carga; conserva un nombre accesible.
- `aria-disabled="true"` en enlaces exige además impedir navegación en la
  aplicación; no sustituye `disabled` en un botón nativo.
- No uses `div`, `span` ni `role="button"` si un `<button>` resuelve el caso.

## Form

Cada control requiere un `<label>` asociado. Las ayudas y errores se conectan
con `aria-describedby`; los errores usan `aria-invalid="true"`.

```html
<label class="ro-label" for="email">Correo electrónico</label>
<input
  id="email"
  class="ro-input-box"
  type="email"
  autocomplete="email"
  required
  aria-describedby="email-help"
>
<p id="email-help" class="ro-hint">Usaremos este correo para avisos.</p>
```

```html
<label class="ro-label" for="workspace">Nombre del workspace</label>
<input
  id="workspace"
  class="ro-input-box"
  aria-invalid="true"
  aria-describedby="workspace-error"
>
<p id="workspace-error" class="ro-error-text">El nombre ya está en uso.</p>
```

- Usa tipos nativos (`email`, `number`, `date`) y `autocomplete` correcto.
- Un placeholder no reemplaza un label.
- El error debe explicar cómo corregirlo, no solo indicar que existe.
- Los switch usan un `<input type="checkbox">` real asociado a su label.

