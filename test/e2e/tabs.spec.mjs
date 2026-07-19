import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components.html");
});

test("estado inicial: pestaña seleccionada tabbable y su panel visible", async ({ page }) => {
  await expect(page.locator("#t-temario")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#t-temario")).toHaveAttribute("tabindex", "0");
  await expect(page.locator("#t-discusion")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator("#p-temario")).toBeVisible();
  await expect(page.locator("#p-discusion")).toBeHidden();
});

test("las flechas mueven el foco y activan el panel (activación automática)", async ({ page }) => {
  await page.locator("#t-temario").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#t-discusion")).toBeFocused();
  await expect(page.locator("#t-discusion")).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("#p-discusion")).toBeVisible();
  await expect(page.locator("#p-temario")).toBeHidden();
  // Solo la pestaña activa es tabbable.
  await expect(page.locator("#t-temario")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator("#t-discusion")).toHaveAttribute("tabindex", "0");
});

test("Home y End van a la primera y última pestaña", async ({ page }) => {
  await page.locator("#t-temario").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#t-checkpoints")).toBeFocused();
  await expect(page.locator("#p-checkpoints")).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.locator("#t-temario")).toBeFocused();
  await expect(page.locator("#p-temario")).toBeVisible();
});

test("ArrowLeft desde la primera envuelve a la última", async ({ page }) => {
  await page.locator("#t-temario").focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator("#t-checkpoints")).toBeFocused();
});
