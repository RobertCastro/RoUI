# Toast / notificaciones accesibles

Los toasts anuncian eventos transitorios sin robar el foco. El marcado aporta la
región contenedora; el `toast-controller` gestiona la inserción como región viva,
el cierre automático, la pausa al interactuar y el botón de cierre.

## Anuncio (regiones vivas)

Cada toast se inserta como su propia región viva, según el patrón **Alert** de
WAI-ARIA: los avisos de éxito e info usan `role="status"` (anuncio *cortés*, no
interrumpe) y los errores usan `role="alert"` (anuncio *asertivo*, interrumpe al
lector). No se traslada el foco al toast; el usuario sigue en su tarea y el
lector de pantalla lee el mensaje al insertarse el nodo.

```html
<!-- La región contenedora es solo posicionamiento; la crea el controlador si
     no existe. Cada toast lleva su propio role. -->
<div class="ro-toast-region"></div>
```

```js
import { createToastController } from "@robertcastro/roui/primitives/toast-controller";

const toaster = createToastController({
  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
  icon: (variant) => spriteFor(variant), // opcional: markup de icono por variante
});

toaster.success("Cambios guardados");                 // role=status
toaster.error("No se pudo guardar. Reintenta.");       // role=alert
toaster.info("Tienes 2 notificaciones", { duration: 0 }); // persistente
```

## Comportamiento

- **Cierre automático**: por defecto a los 5000 ms. `duration: 0` (o `Infinity`)
  deja el toast persistente hasta que el usuario lo cierre.
- **Pausa al interactuar**: al pasar el puntero (`pointerenter`) o enfocar dentro
  del toast (`focusin`) se detiene el temporizador; al salir (`pointerleave` /
  `focusout`) se reanuda. Así el usuario no pierde el mensaje mientras lo lee o
  usa el botón de cierre.
- **Cierre manual**: cada toast incluye un `button.ro-toast__close` con
  `aria-label` (por defecto «Cerrar») y anillo de foco visible; `dismissible:
  false` lo omite. `dismiss()` en el handle y `dismissAll()` cierran por código.
- **Movimiento reducido**: con `reducedMotion: true` se elimina la animación de
  entrada/salida (también cubierto por `@media (prefers-reduced-motion)` en CSS).

## Contrato del marcado

- El icono es decorativo: va en `.ro-toast__icon` con `aria-hidden="true"`; el
  mensaje es el único contenido anunciado.
- La región no fija foco ni atrapa teclado: no es un diálogo. Para acciones que
  requieran decisión usa Dialog (ver `dialog-drawer.md`), no un toast.
- El controlador no depende de un set de iconos: `options.icon(variant)` devuelve
  el markup (o `""`) para cada variante, incluida `"close"`.

## Límites y verificación manual

- Sin apilado con límite máximo, colas ni posicionamiento por colisiones.
- Comprueba con lector de pantalla: un `success`/`info` se anuncia sin
  interrumpir; un `error` interrumpe; el foco permanece en el disparador.
- Comprueba con teclado: `Tab` alcanza el botón de cierre (anillo visible) y
  `Enter`/`Espacio` lo descartan; al pasar el puntero el toast no desaparece.
- Axe, matriz de navegadores y regresión visual se incorporan en Fase 4.
