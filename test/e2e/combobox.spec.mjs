import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components.html");
});

const input = "#cb-lang";
const options = '#cb-lang-list [role="option"]:not([hidden])';

test("al enfocar abre la lista (aria-expanded)", async ({ page }) => {
  await expect(page.locator(input)).toHaveAttribute("aria-expanded", "false");
  await page.locator(input).focus();
  await expect(page.locator(input)).toHaveAttribute("aria-expanded", "true");
});

test("filtra las opciones al escribir", async ({ page }) => {
  await page.locator(input).click();
  await page.locator(input).fill("Typ");
  await expect(page.locator(options)).toHaveCount(1);
  await expect(page.locator(options)).toHaveText("TypeScript");
});

test("las flechas activan una opción sin sacar el foco del input", async ({ page }) => {
  await page.locator(input).click();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(input)).toBeFocused();
  const active = await page.locator(input).getAttribute("aria-activedescendant");
  expect(active).toBeTruthy();
  await expect(page.locator(`#${active}`)).toHaveAttribute("aria-selected", "true");
});

test("Enter selecciona la opción activa y cierra la lista", async ({ page }) => {
  await page.locator(input).click();
  await page.locator(input).fill("Typ");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.locator(input)).toHaveValue("TypeScript");
  await expect(page.locator(input)).toHaveAttribute("aria-expanded", "false");
});

test("Escape cierra la lista sin perder el foco del input", async ({ page }) => {
  await page.locator(input).click();
  await expect(page.locator(input)).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(page.locator(input)).toHaveAttribute("aria-expanded", "false");
});
