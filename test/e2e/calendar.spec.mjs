import { test, expect } from "@playwright/test";

// Calendario autónomo (primer [data-calendar]): Junio 2026, día 12 preseleccionado.
// El lunes 1 abre la primera columna, así que las semanas son 1-7, 8-14, 15-21, …
test.beforeEach(async ({ page }) => {
  await page.goto("/docs/components.html");
});

function grid(page) {
  return page.locator("[data-calendar]").first().locator(".ro-calendar__grid");
}
function day(page, n) {
  return grid(page).getByRole("gridcell", { name: `${n} de Junio de 2026` });
}

test("estado inicial: el día seleccionado es el tabbable del grid", async ({ page }) => {
  await expect(grid(page)).toHaveAttribute("role", "grid");
  await expect(day(page, 12)).toHaveAttribute("tabindex", "0");
  await expect(day(page, 13)).toHaveAttribute("tabindex", "-1");
});

test("las flechas navegan por día y por semana", async ({ page }) => {
  await day(page, 12).click();
  await expect(day(page, 12)).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(day(page, 13)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(day(page, 20)).toBeFocused();
  await page.keyboard.press("ArrowUp");
  await expect(day(page, 13)).toBeFocused();
});

test("Home y End van al inicio y fin de la semana", async ({ page }) => {
  await day(page, 20).click();
  await page.keyboard.press("Home");
  await expect(day(page, 15)).toBeFocused();
  await page.keyboard.press("End");
  await expect(day(page, 21)).toBeFocused();
});

test("Enter selecciona el día activo (aria-selected)", async ({ page }) => {
  await day(page, 12).click();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Enter");
  await expect(day(page, 13)).toHaveAttribute("aria-selected", "true");
  await expect(day(page, 12)).toHaveAttribute("aria-selected", "false");
});
