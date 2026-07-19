# F7-004: Telemetría y métricas de adopción (plantillas)

- Estado: review
- Fase: 7
- Dependencias: F7-001
- ADR relacionados: ADR-0005

## Objetivo

Definir qué medir y cómo para cuantificar la adopción e impacto de RoUI, dejando la
infraestructura lista para conectarla a un piloto.

## Contexto

La telemetría e impacto reales exigen un producto que consuma RoUI. Se prepara el
marco (métricas, principios de privacidad, esquema de eventos y señales sin
runtime) para que instrumentar sea directo.

## Alcance

- Incluido: `docs/adoption/adoption-metrics.md` (qué medir, principios de
  privacidad, cómo obtener señales sin telemetría en runtime) y
  `docs/adoption/telemetry-events.schema.json` (esquema JSON de eventos opt-in).
- Excluido: la instrumentación real y el reporte, que dependen de un piloto
  (bloqueado hasta elegir producto).

## Progreso

- [x] Marco de métricas de adopción documentado.
- [x] Principios de privacidad (mide proyectos/equipos, no personas; opt-in).
- [x] Esquema de eventos de telemetría (JSON Schema).
- [x] Recetas para obtener señales escaneando el código consumidor.

## Criterios de aceptacion

- [x] Existe un marco claro de qué medir y con qué esquema.
- [x] Se respetan principios de privacidad (sin datos de usuarios finales).
- [x] `npm run validate` y `git diff --check` verdes.

## Estado real

Plantillas e infraestructura listas. La ejecución (instrumentar el piloto, recoger
y reportar métricas) queda **bloqueada hasta designar un producto piloto**; es una
decisión del mantenedor.

## Cierre

- Resultado: marco de métricas de adopción y esquema de eventos, listos para
  conectar a un piloto.
- Archivos: `docs/adoption/adoption-metrics.md`,
  `docs/adoption/telemetry-events.schema.json`,
  `docs/roadmap/{progress,current-phase}.md`.
- Comandos: `npm run validate`, `git diff --check`.
- Riesgos pendientes: instrumentación y reporte dependen del piloto.
- Siguiente tarea desbloqueada: F7-005 (soporte y feedback).
