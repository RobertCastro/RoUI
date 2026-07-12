# Presupuesto de paquete

El paquete npm de RoUI no puede superar los siguientes limites sin un ADR
aceptado o una justificación trazable en la tarea activa, conforme a ADR-0005:

| Medida | Limite |
|---|---:|
| Tarball comprimido | 64 KiB |
| Contenido descomprimido | 272 KiB |

`npm run check:size` empaqueta el artefacto real y aplica ambos limites. Los
presupuestos cubren el paquete publicado; no incluyen `node_modules`, fixtures
ni documentacion del repositorio.

F3-002 eleva el límite descomprimido desde 256 KiB: el controlador público de
overlays se distribuye como ESM generado y su fuente para que consumidores y
documentación compartan una única implementación. El tarball medido fue de
271 802 bytes descomprimidos; no añade dependencias de producción y conserva el
límite comprimido. Todo nuevo artefacto público debe justificar su tamaño o
reducir otro contenido.
