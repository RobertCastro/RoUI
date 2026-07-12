# Fase activa: 2 — Tokens y temas

## Objetivo

Establecer una única fuente DTCG para los valores de diseño y permitir temas,
marcas y salidas de plataforma sin bifurcar componentes.

## Trabajo permitido

- Migrar tokens a formato DTCG y validar referencias.
- Generar variables CSS, JSON público y preset Tailwind.
- Introducir tokens primitivos, semánticos y de componente.
- Diseñar temas light, dark y high-contrast.
- Validar contraste y eliminar valores visuales duplicados.

## Fuera de alcance

- Crear adaptadores por framework.
- Cambiar comportamiento de componentes interactivos.
- Declarar componentes accesibles `stable`.
- Agregar componentes visuales por volumen.

## Orden inicial

1. F2-001: fuente DTCG única y pipeline de generación.
2. Definir temas light, dark y high-contrast.
3. Crear tokens semánticos y de componente.
4. Validar contraste, aliases y valores literales restantes.

## Baseline

```bash
npm run check:tokens
npm run validate
```

## Condiciones de salida

- Una única fuente editable para cada valor de diseño.
- CSS y Tailwind generados y validados desde DTCG.
- Temas light, dark y high-contrast probados.
- No quedan valores visuales duplicados sin tarea de remediación.
- Auditoría humana aprueba el cierre de Fase 2.
