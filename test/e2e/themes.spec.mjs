import { test, expect } from "@playwright/test";

// Matriz de temas: verifica que activar `data-ro-theme` remapea los tokens
// semánticos en el navegador (en los tres motores). El contraste AA de cada par
// de tokens lo gatea `check:contrast`; aquí comprobamos que el switch aplica.
const THEMES = {
  light: { "--ro-bg": "#f7f7f8", "--ro-text": "#171719", "--ro-surface": "#ffffff" },
  dark: { "--ro-bg": "#171719", "--ro-text": "#ffffff", "--ro-surface": "#242426" },
  "high-contrast": { "--ro-bg": "#000000", "--ro-text": "#ffffff", "--ro-surface": "#000000" },
};

for (const [theme, tokens] of Object.entries(THEMES)) {
  test(`el tema ${theme} remapea los tokens semánticos`, async ({ page }) => {
    await page.goto("/docs/components.html");
    await page.evaluate((t) => document.documentElement.setAttribute("data-ro-theme", t), theme);
    const values = await page.evaluate((names) => {
      const s = getComputedStyle(document.documentElement);
      return names.reduce((acc, n) => { acc[n] = s.getPropertyValue(n).trim().toLowerCase(); return acc; }, {});
    }, Object.keys(tokens));
    for (const [name, expected] of Object.entries(tokens)) {
      expect(values[name]).toBe(expected);
    }
  });
}
