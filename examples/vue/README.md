# Starter de Vue (sin build)

Consume `@robertcastro/roui` en Vue 3 sin paso de compilación (Vue con compilador
de plantillas desde jsDelivr, RoUI desde jsDelivr). Patrón de integración:
instanciar la primitiva en `onMounted` sobre una `ref` y destruirla en
`onBeforeUnmount`.

```bash
npx serve examples/vue
```

En un proyecto real usa SFC (`.vue`) con un bundler; el build runtime-only basta si
no declaras `template` en línea.
