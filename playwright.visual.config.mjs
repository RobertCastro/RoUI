import { defineConfig, devices } from "@playwright/test";

// Config de regresión visual (F4-004). Separada de la suite funcional para que
// `test:e2e` no dependa de imágenes de referencia. Los snapshots son específicos
// del SO (Playwright los sufija con la plataforma); se versionan por entorno.
const PORT = 8799;

export default defineConfig({
  testDir: "./test/visual",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // Tolerancia pequeña para diferencias de subpíxel entre ejecuciones del mismo SO.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: `http://127.0.0.1:${PORT}/docs/components.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
