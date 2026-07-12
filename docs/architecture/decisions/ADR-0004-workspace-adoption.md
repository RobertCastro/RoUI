# ADR-0004: Adoptar workspaces cuando existan paquetes independientes

- Estado: accepted
- Fecha: 2026-07-11
- Fase: 1
- Propietario: mantenedores de RoUI

## Contexto

RoUI publica actualmente un solo paquete npm, tiene un solo build y sus
fixtures consumidoras no se distribuyen. La arquitectura objetivo anticipa
paquetes de tokens, CSS, iconos, primitivas y adaptadores, pero ninguno existe
aun como unidad con consumidor, version o ciclo de build independiente.

## Alternativas evaluadas

| Opcion | Ventaja | Costo actual |
|---|---|---|
| Mantener repositorio unico | Minima complejidad y un solo grafo de build | Menor aislamiento futuro |
| npm workspaces | Aisla paquetes cuando aparezcan | Paquetes vacios, migracion y tooling adicional ahora |
| Turborepo/Nx | Cache y orquestacion a gran escala | Complejidad adicional sin tareas paralelas reales |

## Decision

Mantener repositorio unico durante Fase 1. No se crearan directorios `packages/`
ni se adoptara un orquestador hasta que existan al menos dos paquetes con una
responsabilidad publica y ciclo de build independientes.

Cuando se cumpla ese umbral, usar npm workspaces como primera opcion. Evaluar
Turborepo o Nx solo si CI demuestra builds repetidos costosos o tareas
independientes suficientes para aprovechar cache/orquestacion.

## Criterios para reabrir la decision

- Se introduce el generador DTCG de tokens con artefactos propios.
- Se publica un adaptador React u otro framework como paquete separado.
- Iconos, CSS o tooling requieren versionado o release independiente.
- Dos o mas paquetes tienen fixtures consumidoras y comandos de build propios.
- La CI supera cinco minutos por trabajo repetido medido.

## Cache y operacion actual

- `package-lock.json` bloquea dependencias.
- GitHub Actions usa cache npm y `npm ci`.
- El build y las fixtures se ejecutan desde un solo comando: `npm run validate`.
- El propietario revisa esta decision al iniciar Fase 2 y ante cualquier criterio
  de reapertura.

## Consecuencias

- Evitamos paquetes sin consumidor o responsabilidad definida.
- La estructura destino sigue documentada, pero no se adelanta su migracion.
- La Fase 2 puede crear el primer limite de paquete real si DTCG lo requiere.

