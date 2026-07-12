# Presupuesto de paquete

El paquete npm de RoUI no puede superar los siguientes limites sin un ADR
aceptado:

| Medida | Limite |
|---|---:|
| Tarball comprimido | 64 KiB |
| Contenido descomprimido | 256 KiB |

`npm run check:size` empaqueta el artefacto real y aplica ambos limites. Los
presupuestos cubren el paquete publicado; no incluyen `node_modules`, fixtures
ni documentacion del repositorio.

Tras F2-004 quedan aproximadamente 2 KiB sin comprimir antes del límite. Todo
nuevo artefacto público debe justificar su tamaño o reducir otro contenido.
