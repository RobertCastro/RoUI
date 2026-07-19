# Starter de React (sin build)

Consume `@robertcastro/roui` en React sin paso de compilación (React desde
esm.sh, RoUI desde jsDelivr). Muestra el patrón de integración: instanciar una
primitiva en `useEffect` sobre una `ref` y destruirla al desmontar.

```bash
npx serve examples/react   # sirve por HTTP (los módulos ESM no cargan por file://)
```

En un proyecto real: `npm install @robertcastro/roui`, importa el CSS una vez y usa
un bundler.
