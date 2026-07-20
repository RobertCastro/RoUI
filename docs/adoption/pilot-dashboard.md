# Piloto local: Dashboard de adopcion

Fecha: 2026-07-20

## Objetivo

Validar RoUI en una experiencia de producto mas completa que los starters:
dashboard operativo con navegacion, metricas, tabla, tabs, modal de intake,
toast y cambio de tema.

## Ubicacion

`examples/pilot-dashboard/`

## Alcance cubierto

- Consumo del paquete publicado `@robertcastro/roui@1.1.0` desde CDN.
- Integracion sin build, usando solo HTML, CSS y primitivas ESM.
- Primitivas verificadas en el flujo: `overlay-controller`,
  `tabs-controller` y `toast-controller`.
- Temas `light`, `dark` y `high-contrast` mediante `data-ro-theme`.
- Estados accesibles en tabs, modal y notificaciones.

## Evidencia esperada

1. Servir el repo por HTTP.
2. Abrir `examples/pilot-dashboard/`.
3. Cambiar tema desde el boton de la cabecera.
4. Navegar tabs con flechas, `Home` y `End`.
5. Abrir `Nuevo piloto`, verificar foco modal y cerrar con `Escape`.
6. Guardar el formulario y comprobar el toast.

## Estado

El piloto local reduce el riesgo tecnico de adopcion y queda como referencia para
un consumidor real. No cierra Fase 7: falta que un producto externo o interno
adopte RoUI en produccion y reporte metricas/feedback.
