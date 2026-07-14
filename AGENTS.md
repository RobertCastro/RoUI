# RoUI Agent Operating Manual

Este archivo define las reglas obligatorias para personas y agentes de IA que
trabajen en este repositorio. Su objetivo es preservar el contexto, limitar la
deriva de alcance y hacer verificable cada avance.

## Mision

Convertir RoUI en un sistema de diseno accesible, multimarca, multi-proyecto y
multi-framework, con APIs estables, documentacion contractual y calidad
automatizada.

## Jerarquia de autoridad

Antes de tomar una decision, consultar en este orden:

1. `docs/product/vision.md`
2. `docs/product/principles.md`
3. `docs/architecture/target-architecture.md`
4. ADR aceptados en `docs/architecture/decisions/`
5. `docs/roadmap/current-phase.md`
6. La tarea activa en `docs/tasks/`
7. La solicitud actual del usuario

Si dos fuentes se contradicen, prevalece la de mayor nivel. Una peticion que
cambie vision, arquitectura o alcance debe registrarse antes de implementarse.

## Protocolo obligatorio al iniciar trabajo

1. Leer este archivo por completo.
2. Leer vision, principios, arquitectura y fase activa.
3. Identificar la tarea activa y sus criterios de aceptacion.
4. Leer los ADR relacionados.
5. Ejecutar `git status --short` y preservar cambios ajenos.
6. Ejecutar el baseline definido por la fase, si existe.
7. Declarar objetivo, alcance, archivos previstos y validaciones.
8. Implementar solamente una tarea `ready` o `in-progress`.

## Reglas de ejecucion

- No iniciar una fase nueva hasta cerrar formalmente la actual.
- No ampliar el alcance de una tarea sin actualizarla y justificar el cambio.
- No agregar dependencias estructurales sin un ADR aceptado.
- No editar artefactos generados manualmente.
- No duplicar fuentes de verdad para tokens, APIs o metadatos.
- No introducir valores visuales literales cuando exista un token apropiado.
- No romper APIs publicas sin plan de migracion y cambio de version adecuado.
- No afirmar que una tarea termino sin evidencia de sus quality gates.
- No mezclar cambios funcionales, redisenos y refactors no relacionados.
- No sobrescribir, descartar ni incluir en commits cambios locales ajenos.
- No crear ramas cuyo nombre contenga la palabra `codex`, sin importar
  mayusculas o minusculas.
- No incluir referencias a `codex` en los mensajes de commit, sin importar
  mayusculas o minusculas.
- No incluir en los mensajes de commit ninguna referencia al modelo, agente o
  herramienta de IA/LLM que ejecuta el commit: sin nombres de modelo o
  proveedor, sin lineas de tipo `Co-Authored-By` de un LLM, sin frases como
  "generado con", ni firmas o metadatos equivalentes. Los commits describen el
  cambio, no quien lo tecleo.
- Cuando el estado documentado y el repositorio difieran, detener la
  implementacion y reconciliar primero la discrepancia.

## Politica temporal de compatibilidad

RoUI no tiene aun una aplicacion estable consumidora. Durante las Fases 0, 1 y
2 se permiten breaking changes para corregir fundamentos, nombres, estructura
y contratos. No se requiere compatibilidad hacia atras en estas fases, pero
cada ruptura debe:

- aparecer en la tarea activa y en el informe de cierre;
- actualizar documentacion, ejemplos y fixtures en el mismo cambio;
- eliminar el contrato anterior completamente para no mantener dos caminos;
- conservar una decision trazable cuando afecte la arquitectura.

Esta excepcion termina antes de publicar la primera release candidata estable.

## Estados permitidos para una tarea

`backlog -> ready -> in-progress -> review -> verified -> done`

- `ready`: dependencias resueltas y criterios de aceptacion comprobables.
- `in-progress`: baseline ejecutado y alcance declarado.
- `review`: implementacion, pruebas y documentacion completas.
- `verified`: revision y quality gates aprobados.
- `done`: progreso global actualizado y trabajo integrado.

Una tarea no puede pasar directamente de `in-progress` a `done`.

## Definition of Done

Toda tarea debe cumplir `docs/quality/definition-of-done.md`, ademas de sus
criterios particulares. Una excepcion debe quedar documentada con responsable,
riesgo, fecha de expiracion y tarea de remediacion.

## Cierre obligatorio de cada sesion

Registrar o comunicar:

- Resultado y estado real de la tarea.
- Criterios de aceptacion cumplidos y pendientes.
- Archivos modificados.
- Comandos de validacion ejecutados y sus resultados.
- Decisiones nuevas o desviaciones.
- Riesgos, bloqueos y siguiente paso recomendado.
- Actualizacion de `docs/roadmap/progress.md` cuando corresponda.

No usar expresiones como "deberia funcionar" como sustituto de validacion.

## Ejecucion del programa

Cada fase se ejecuta mediante el protocolo definido en
`docs/roadmap/execution-plan.md`. Ese documento establece preparacion, baseline,
descomposicion, quality gates, auditoria, aprobacion y transicion. No se puede
sustituir el protocolo con una lista informal en una conversacion.
