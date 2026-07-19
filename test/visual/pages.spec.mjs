import { test, expect } from "@playwright/test";

// Regresión visual de página completa. Captura el estado estático inicial (sin
// overlays abiertos ni toasts). Los snapshots se sufijan por plataforma; ver
// docs/tasks/F4-004 para regenerarlos en Linux (contenedor de Playwright).
const PAGES = [
  ["index", "/docs/index.html"],
  ["tokens", "/docs/tokens.html"],
  ["icons", "/docs/icons.html"],
  ["layouts", "/docs/layouts.html"],
  ["components", "/docs/components.html"],
  ["template-dashboard", "/docs/templates/dashboard.html"],
  ["template-module-3col", "/docs/templates/module-3col.html"],
];

for (const [name, path] of PAGES) {
  test(`snapshot: ${name}`, async ({ page }) => {
    await page.goto(path);
    // Espera a que las fuentes y el sprite de iconos estén listos para estabilizar el render.
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}
