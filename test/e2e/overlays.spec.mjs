import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components.html");
});

test.describe("Dialog modal", () => {
  const trigger = '[data-ro-overlay-open="demoModal"]';

  test("abre, atrapa el foco y marca aria-expanded", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator("#demoModal")).toBeVisible();
    // Primer foco: el botón de cerrar del panel.
    await expect(page.locator('#demoModal [aria-label="Cerrar"]')).toBeFocused();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "true");
  });

  test("Escape cierra y devuelve el foco al disparador", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator("#demoModal")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#demoModal")).toBeHidden();
    await expect(page.locator(trigger)).toBeFocused();
    await expect(page.locator(trigger)).toHaveAttribute("aria-expanded", "false");
  });

  test("el trap de Tab hace ciclo dentro del diálogo", async ({ page }) => {
    await page.locator(trigger).click();
    // Foco en el primer focusable (cerrar); Shift+Tab envuelve al último.
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator('#demoModal [data-ro-overlay-close].ro-btn--primary')).toBeFocused();
    // Tab desde el último vuelve al primero.
    await page.keyboard.press("Tab");
    await expect(page.locator('#demoModal [aria-label="Cerrar"]')).toBeFocused();
  });

  test("un control de cierre en el pie cierra el modal", async ({ page }) => {
    await page.locator(trigger).click();
    await page.locator('#demoModal .ro-btn--soft[data-ro-overlay-close]').click();
    await expect(page.locator("#demoModal")).toBeHidden();
    await expect(page.locator(trigger)).toBeFocused();
  });
});

test.describe("Drawer lateral", () => {
  const trigger = '[data-ro-overlay-open="navDrawer"]';

  test("abre con foco en el panel y Escape restaura el foco", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator("#navDrawer .ro-drawer")).toBeVisible();
    await expect(page.locator('#navDrawer [aria-label="Cerrar menú"]')).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(page.locator("#navDrawer")).toBeHidden();
    await expect(page.locator(trigger)).toBeFocused();
  });

  test("clic en el backdrop cierra el drawer", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator("#navDrawer .ro-drawer")).toBeVisible();
    await page.locator("#navDrawer [data-ro-overlay-backdrop]").click();
    await expect(page.locator("#navDrawer")).toBeHidden();
  });
});

test.describe("Bottom-sheet", () => {
  const trigger = '[data-ro-overlay-open="sheet"]';

  test("abre y el botón de cierre lo descarta", async ({ page }) => {
    await page.locator(trigger).click();
    await expect(page.locator("#sheet .ro-drawer")).toBeVisible();
    await page.locator('#sheet [aria-label="Cerrar temario"]').click();
    await expect(page.locator("#sheet")).toBeHidden();
    await expect(page.locator(trigger)).toBeFocused();
  });
});
