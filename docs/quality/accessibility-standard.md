# Estandar de accesibilidad

## Objetivo

Los componentes estables de RoUI deben cumplir WCAG 2.2 nivel AA y seguir los
patrones aplicables de WAI-ARIA Authoring Practices, sin sustituir semantica
HTML nativa cuando esta sea suficiente.

## Requisitos generales

- Operacion completa por teclado.
- Orden y restauracion de foco predecibles.
- Indicadores de foco visibles con contraste suficiente.
- Nombre, rol, valor y estado comunicados correctamente.
- Contraste de texto, iconos y controles conforme al estandar.
- Reflow y zoom sin perdida de informacion o funcionalidad.
- Touch targets adecuados o espaciado equivalente.
- Errores identificados y asociados a sus controles.
- Animacion compatible con `prefers-reduced-motion`.
- Contenido dinamico anunciado cuando corresponda.
- Compatibilidad RTL y localizacion en componentes estables.

## Validacion

Automatizacion con axe y pruebas de teclado, complementadas con auditorias
manuales y lectores de pantalla en componentes de alta complejidad. Pasar axe
no equivale por si solo a cumplir este estandar.

