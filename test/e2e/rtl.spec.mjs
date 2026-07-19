import { test, expect } from "@playwright/test";

// Matriz RTL: la librería de componentes debe soportar dirección derecha-izquierda
// sin provocar scroll horizontal. Se verifica sobre las páginas representativas de
// componentes (la galería y la plantilla de módulo), en los tres motores.
// Nota: el reflow a 320 px y el RTL del template de dashboard exponen anchos fijos
// del contenido de demostración (no de los primitivos); ver la tarea F4-005.
const PAGES = ["/docs/components.html", "/docs/templates/module-3col.html"];

for (const path of PAGES) {
  test(`RTL aplica y no genera scroll horizontal: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(2);
  });
}
