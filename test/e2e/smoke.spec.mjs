import { test, expect } from "@playwright/test";

// Verifica que los módulos ESM de docs.js cargan y cablean la interactividad
// (si el servidor no sirviera el MIME correcto de los módulos, esto fallaría).
test("la galería carga y el sprite/controladores se inicializan", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/docs/components.html");
  // El modal arranca oculto y su disparador cableado por docs.js.
  const trigger = page.locator('[data-ro-overlay-open="demoModal"]');
  await expect(trigger).toBeVisible();
  await expect(page.locator("#demoModal")).toBeHidden();
  expect(errors, "sin errores de página").toEqual([]);
});
