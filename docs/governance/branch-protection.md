# Protección de rama `main`

Las protecciones de rama son ajustes del repositorio en GitHub (no viven en el
código). Esta es la configuración recomendada para `main`.

## Reglas recomendadas

- Requerir pull request antes de integrar (sin push directo a `main`).
- Requerir al menos 1 revisión aprobada y respetar `CODEOWNERS`.
- Requerir que los checks de estado pasen y estén al día:
  - `baseline` (validate + pack + audit)
  - `e2e` (navegadores)
  - `CodeQL`
  - `Supply chain / dependency-review`
- Requerir historial lineal (merge por squash).
- Descartar aprobaciones obsoletas al hacer push nuevo.
- Aplicar las reglas también a administradores.

## Cómo aplicarlas

Interfaz: Settings → Branches → Add branch ruleset (o Branch protection rule)
para `main`, y marca las opciones anteriores.

CLI (ajusta los contextos de check a los nombres reales de tus jobs):

```bash
gh api -X PUT repos/RobertCastro/RoUI/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f "required_status_checks[strict]=true" \
  -f "required_status_checks[contexts][]=baseline" \
  -f "required_status_checks[contexts][]=e2e" \
  -F "enforce_admins=true" \
  -f "required_pull_request_reviews[required_approving_review_count]=1" \
  -f "required_pull_request_reviews[require_code_owner_reviews]=true" \
  -F "restrictions=" \
  -F "required_linear_history=true"
```

> La publicación a npm y la creación de la PR de versión dependen de estas
> protecciones y de los secretos (`NPM_TOKEN`) y permisos ya configurados.

## Nota para un solo mantenedor

Con un único mantenedor, exigir 1 revisión aprobada puede bloquear el merge. En
ese caso, mantén los checks de estado obligatorios y el flujo por PR, y ajusta el
número de revisiones a 0 hasta que haya más colaboradores.
