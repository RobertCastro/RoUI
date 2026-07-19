import { defineConfig, devices } from "@playwright/test";

// Config de pruebas de navegador (F4-002). Levanta el sitio estático de docs con
// el mismo servidor que `npm start` y ejecuta los specs en test/e2e.
const PORT = 8799;

export default defineConfig({
  testDir: "./test/e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `python3 -m http.server ${PORT}`,
    url: `http://127.0.0.1:${PORT}/docs/components.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
