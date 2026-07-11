# Plan de ejecucion del programa

Este documento define como se ejecutan todas las fases del roadmap y es el
contrato operativo para personas y agentes de IA.

## Regla principal

Solo existe una fase activa y una tarea de implementacion activa a la vez. Se
puede preparar trabajo futuro, pero no implementarlo antes de cumplir las
condiciones de entrada.

## Ciclo de una fase

### 1. Preparacion

- Confirmar objetivo, alcance permitido y fuera de alcance.
- Resolver o proponer los ADR que bloqueen decisiones.
- Identificar dependencias, riesgos y responsables de aprobacion.
- Definir condiciones de entrada y salida.

### 2. Baseline

- Ejecutar `npm run baseline` y los comandos propios de la fase.
- Registrar metricas iniciales y fallos conocidos.
- No ocultar deuda existente haciendo que el baseline falle sin una tarea de
  remediacion; convertirla en hallazgo trazable.

### 3. Descomposicion

- Crear tareas pequenas desde `docs/tasks/TEMPLATE.md`.
- Cada tarea debe tener criterios observables, dependencias y validaciones.
- Ordenar tareas por dependencias y riesgo, no por facilidad visual.

### 4. Ejecucion de una tarea

1. Mover `ready` a `in-progress`.
2. Declarar objetivo, alcance, archivos y validaciones.
3. Ejecutar baseline relevante.
4. Implementar solo lo descrito.
5. Ejecutar pruebas y registrar evidencia.
6. Mover a `review`; nunca directamente a `done`.
7. Corregir hallazgos y mover a `verified`.
8. Integrar, actualizar progreso y mover a `done`.

### 5. Quality gates

Aplicar `docs/quality/definition-of-done.md` y la matriz de
`docs/quality/testing-strategy.md`. CI es el arbitro automatico; una excepcion
requiere deuda con responsable y expiracion.

### 6. Auditoria de fase

Preparar un informe que compare:

- Entregables prometidos frente a entregados.
- Baseline inicial frente a metricas finales.
- Pruebas ejecutadas y cobertura.
- Riesgos eliminados, aceptados y transferidos.
- Breaking changes y migraciones.
- Deuda pendiente y razon para no bloquear el cierre.

### 7. Aprobacion

Un revisor humano aprueba, solicita correcciones o acepta una excepcion
temporal. Un agente no puede autoaprobar el cierre completo de una fase.

### 8. Transicion

- Marcar entregables y fase con su estado real.
- Actualizar `current-phase.md` y `progress.md`.
- Aceptar los ADR resultantes.
- Preparar y validar el backlog de la fase siguiente.
- Ejecutar el nuevo baseline antes de la primera implementacion.

## Cadencia

- Una tarea de implementacion por sesion siempre que sea posible.
- Entre una y tres tareas estrechamente relacionadas por PR.
- Informe de progreso al completar cada bloque.
- Auditoria obligatoria antes de cambiar de fase.

## Politica de cambios incompatibles

No existen consumidores estables durante las fases fundacionales. Las Fases 0,
1 y 2 pueden reemplazar contratos actuales sin capa de compatibilidad. Toda
ruptura debe estar documentada, eliminar el camino anterior y dejar verdes los
ejemplos, pruebas y documentacion del nuevo contrato.

Desde la primera release candidata estable, los cambios incompatibles exigiran
version mayor, deprecacion cuando corresponda y guia de migracion.

## Orden de ejecucion

1. Fase 0: contexto, baseline, inventario, soporte, CI y backlog.
2. Fase 1: paquetes, exports, reset, layers y consumidores de prueba.
3. Fase 2: fuente unica de tokens y temas.
4. Fase 3: primitivas accesibles por componente.
5. Fase 4: matriz integral de calidad.
6. Fase 5: documentacion contractual.
7. Fase 6: releases, seguridad y gobernanza.
8. Fase 7: pilotos y adopcion multi-proyecto.

