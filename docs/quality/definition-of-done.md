# Definition of Done

Una tarea solo puede marcarse `done` si aplica y cumple lo siguiente.

## Alcance y arquitectura

- Cumple su objetivo y criterios de aceptacion sin cambios laterales ocultos.
- Respeta vision, principios, arquitectura y ADR aceptados.
- Las decisiones nuevas estan documentadas.
- No introduce duplicacion de fuentes de verdad.

## Implementacion

- APIs y entrypoints publicos estan tipados o documentados.
- Estados normal, hover, focus, active, disabled, invalid y loading fueron
  considerados cuando correspondan.
- No hay valores literales evitables ni dependencias internas privadas.
- El cambio es compatible o incluye versionado y migracion.

## Accesibilidad

- Cumple WCAG 2.2 AA dentro del alcance soportado.
- Funciona por teclado y conserva foco visible.
- Semantica, nombres, roles y estados son correctos.
- Reduced motion, zoom, reflow y contraste fueron evaluados.
- Axe no reporta infracciones criticas o serias en fixtures soportadas.

## Pruebas

- Se agregaron o actualizaron pruebas proporcionales al riesgo.
- Build, lint, tipos, unitarias, navegador, accesibilidad y visuales aplicables
  estan verdes.
- Los paquetes y entrypoints afectados se prueban como consumidor externo.
- Los artefactos generados son reproducibles.

## Documentacion y entrega

- Documentacion y ejemplos reflejan el contrato final.
- Se registra cambio de version o changelog cuando corresponda.
- `docs/roadmap/progress.md` refleja el estado real.
- Se documentan comandos ejecutados, riesgos pendientes y proximo paso.
- La revision requerida fue aprobada.

## Excepciones

Toda excepcion debe indicar: regla omitida, motivo, riesgo, responsable, fecha
de expiracion y tarea que eliminara la deuda. Una excepcion indefinida no es
valida.

