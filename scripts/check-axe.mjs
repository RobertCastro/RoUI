#!/usr/bin/env node
/**
 * Gate de accesibilidad automatizado (F4-001).
 *
 * Ejecuta axe-core sobre el DOM estático de las páginas de documentación usando
 * jsdom, sin navegador ni red. Cubre reglas estructurales: roles, nombres
 * accesibles, relaciones ARIA, landmarks, títulos e idioma.
 *
 * Límites conocidos (jsdom no renderiza layout):
 * - `color-contrast` se desactiva aquí; lo cubre `check:contrast` sobre tokens.
 * - Los estados dinámicos (diálogo abierto, panel expandido, listbox visible) y
 *   las reglas que dependen de geometría se verifican con navegador en F4-002/003.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const require = createRequire(import.meta.url);
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const axeSource = readFileSync(require.resolve("axe-core"), "utf8");

const PAGES = [
  "docs/index.html",
  "docs/tokens.html",
  "docs/icons.html",
  "docs/layouts.html",
  "docs/components.html",
  "docs/templates/dashboard.html",
  "docs/templates/module-3col.html",
];

// Paginas de referencia generadas (F5-001): se cubren todas automaticamente.
const refDir = resolve(root, "docs/reference");
if (existsSync(refDir)) {
  for (const file of readdirSync(refDir).filter((f) => f.endsWith(".html"))) {
    PAGES.push(`docs/reference/${file}`);
  }
}

// Reglas que exigen renderizado real; se delegan a otros gates o a Fase 4.
const AXE_OPTIONS = {
  resultTypes: ["violations"],
  rules: {
    "color-contrast": { enabled: false },
  },
};

async function scan(relativePath) {
  const html = readFileSync(resolve(root, relativePath), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://roui.local/" + relativePath,
  });
  const { window } = dom;
  window.eval(axeSource);
  try {
    const results = await window.axe.run(window.document, AXE_OPTIONS);
    return results.violations;
  } finally {
    window.close();
  }
}

function reportPage(relativePath, violations) {
  if (violations.length === 0) {
    console.log(`✓ ${relativePath}: sin violaciones`);
    return 0;
  }
  console.log(`✗ ${relativePath}: ${violations.length} regla(s) con violaciones`);
  let nodeCount = 0;
  for (const violation of violations) {
    console.log(`  · [${violation.impact}] ${violation.id} — ${violation.help}`);
    console.log(`    ${violation.helpUrl}`);
    for (const node of violation.nodes) {
      nodeCount += 1;
      console.log(`    ↳ ${node.target.join(" ")}`);
      const summary = (node.failureSummary || "").split("\n").filter(Boolean);
      for (const line of summary) console.log(`      ${line}`);
    }
  }
  return nodeCount;
}

const failing = [];
let totalNodes = 0;
for (const page of PAGES) {
  // eslint-disable-next-line no-await-in-loop
  const violations = await scan(page);
  const nodes = reportPage(page, violations);
  if (nodes > 0) { failing.push(page); totalNodes += nodes; }
}

if (failing.length > 0) {
  console.error(
    `\naxe encontró ${totalNodes} nodo(s) con violaciones en ${failing.length} página(s): ${failing.join(", ")}`,
  );
  process.exit(1);
}
console.log(`\naxe correcto: ${PAGES.length} páginas sin violaciones (contraste vía check:contrast; estados dinámicos en Fase 4).`);
