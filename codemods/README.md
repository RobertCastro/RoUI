# Codemods de RoUI

Transformaciones automatizadas para migrar marcado a los contratos de RoUI.

## legacy-states

Reemplaza las clases modificadoras de estado heredadas por su atributo ARIA
equivalente, de forma quirúrgica (preserva el resto del marcado).

| Antes (clase) | Después (atributo) |
|---|---|
| `ro-tab--active` | `aria-selected="true"` |
| `ro-nav-link--active` | `aria-current="page"` |
| `ro-calendar__day--selected` | `aria-selected="true"` |
| `ro-breadcrumbs__current--active` | `aria-current="page"` |

### Uso

```bash
# Informe (dry-run):
node codemods/legacy-states.mjs "src/**/*.html"
npm run codemod:legacy-states -- "src/**/*.html"

# Aplicar:
node codemods/legacy-states.mjs "src/**/*.html" --write
```

Pasa los archivos ya expandidos (tu shell resuelve el glob). Revisa el diff antes
de commitear.

### Límites

Solo cubre las transformaciones deterministas de clase → atributo. Los cambios de
**comportamiento** (paneles con `is-open`, listbox que abre/cierra, foco) se migran
a mano: ver la [guía de migración](../docs/reference/migration.md).
