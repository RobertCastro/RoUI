import { test, expect } from "@playwright/test";

const trigger = '[data-ro-overlay-open="demoCmdk"]';

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components.html");
});

test("abre como diálogo modal con el input enfocado", async ({ page }) => {
  await page.locator(trigger).click();
  await expect(page.locator("#demoCmdk")).toBeVisible();
  await expect(page.locator("#demoCmdk .ro-cmdk")).toHaveAttribute("aria-modal", "true");
  await expect(page.locator("#cmdk-input")).toBeFocused();
});

test("el atajo Ctrl/Cmd+K abre la paleta", async ({ page }) => {
  await page.keyboard.press("Control+k");
  await expect(page.locator("#demoCmdk")).toBeVisible();
  await expect(page.locator("#cmdk-input")).toBeFocused();
});

test("filtra las opciones al escribir", async ({ page }) => {
  await page.locator(trigger).click();
  await page.locator("#cmdk-input").fill("Ajustes");
  const visible = page.locator('#cmdk-list [role="option"]:not([hidden])');
  await expect(visible).toHaveCount(1);
  await expect(visible).toHaveText(/Ajustes/);
});

test("las flechas mueven aria-activedescendant sin sacar el foco del input", async ({ page }) => {
  await page.locator(trigger).click();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#cmdk-input")).toBeFocused();
  const active = await page.locator("#cmdk-input").getAttribute("aria-activedescendant");
  expect(active).toBeTruthy();
  await expect(page.locator(`#${active}`)).toHaveAttribute("aria-selected", "true");
});

test("Escape cierra el diálogo y devuelve el foco al disparador", async ({ page }) => {
  await page.locator(trigger).click();
  await expect(page.locator("#demoCmdk")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#demoCmdk")).toBeHidden();
  await expect(page.locator(trigger)).toBeFocused();
});

test("seleccionar una opción con Enter cierra la paleta", async ({ page }) => {
  await page.locator(trigger).click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator("#demoCmdk")).toBeHidden();
});
