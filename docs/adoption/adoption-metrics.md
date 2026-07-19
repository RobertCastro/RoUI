# Métricas de adopción

Marco para medir la adopción e impacto de RoUI. La **instrumentación real depende
de un piloto** (un producto que consuma RoUI); este documento define qué medir,
cómo y con qué esquema, para que conectarlo sea directo.

## Qué medir

| Métrica | Qué indica | Fuente |
|---|---|---|
| Proyectos que adoptan RoUI | Alcance | Inventario manual / registro |
| Componentes en uso por proyecto | Profundidad de adopción | Escaneo de clases `ro-` en el código |
| Cobertura de primitivas | Uso de comportamiento accesible | Imports de `@robertcastro/roui/primitives/*` |
| Esfuerzo de migración | Fricción de adopción | Tiempo/PRs para migrar (codemod + manual) |
| Defectos reportados por área | Calidad percibida | Issues etiquetados |
| Velocidad de UI | Impacto en el equipo | Antes/después en el piloto |

## Principios

- **Privacidad primero**: no recojas datos personales ni de usuarios finales. La
  telemetría de adopción mide *proyectos y equipos*, no personas.
- **Opt-in y transparente**: cualquier telemetría en tiempo de build debe ser
  explícita y documentada; por defecto, apagada.
- **Preferir señales del repositorio**: muchas métricas se obtienen escaneando el
  código (clases `ro-`, imports) sin telemetría en runtime.

## Esquema de eventos

Para telemetría opt-in (p. ej. en un CLI o build plugin del piloto), usa el
esquema en [`telemetry-events.schema.json`](telemetry-events.schema.json). Ejemplo
de evento:

```json
{
  "event": "component_used",
  "project": "acme-web",
  "roui_version": "1.1.0",
  "component": "button",
  "count": 42,
  "timestamp": "2026-07-19T00:00:00Z"
}
```

## Cómo obtener las señales sin runtime

```bash
# Componentes usados (por clase base ro-<algo>) en un proyecto consumidor:
grep -rohE 'ro-[a-z0-9-]+' src | sort | uniq -c | sort -rn

# Primitivas importadas:
grep -rho "@robertcastro/roui/primitives/[a-z-]*" src | sort | uniq -c
```

## Pendiente de piloto

- Elegir el producto piloto e instrumentar (o escanear) sus métricas.
- Definir la cadencia de reporte (p. ej. quincenal).
- Conectar el esquema de eventos si se opta por telemetría en build.
