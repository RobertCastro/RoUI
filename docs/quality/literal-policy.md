# Política de valores literales

Los valores de color, espaciado, radio y dimensiones reutilizables deben
provenir de tokens. `npm run check:literals` registra los literales restantes
fuera de `src/tokens/` y bloquea cambios no revisados en su inventario.

Baseline F2-005: 39 literales de color y 382 valores en píxeles, con huella
`423702225cb0e28ca717941e759a6e3370ca64c1be75f58ad28c24629852b27a`.

Excepciones permitidas actualmente:

- Valores internos de gradientes y overlays cuya composición no se expresa aún
  como token.
- Datos SVG embebidos en controles nativos.
- Medidas geométricas locales para iconos, animaciones y pseudo-elementos.
- Valores de compatibilidad de navegadores que no representan una decisión de
  diseño reutilizable.

Cada nueva excepción requiere justificarla en la tarea correspondiente. Las
migraciones deben reducir el inventario; no basta con sustituir un literal por
otro literal equivalente.

Prioridad de migración:

1. Overlays y estados de interacción repetidos en varios componentes.
2. Gradientes y variantes de alertas que representen decisiones de marca.
3. Medidas de layout repetidas que no pertenezcan a la geometría local.
4. Datos SVG y geometría de pseudo-elementos, solo si existe un consumidor real.
