#!/usr/bin/env node
/**
 * Verificacion de ejemplos de la referencia (F5-003).
 *
 * Garantiza que el codigo mostrado en la documentacion no diverge del sistema:
 * cada clase `ro-*` y cada icono `#ro-i-*` usados en la anatomia y los ejemplos
 * de un manifiesto deben existir en el bundle CSS y en el sprite generados.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestDir = resolve(root, "docs/reference/components");
const css = readFileSync(resolve(root, "dist/roui.css"), "utf8");
const sprite = readFileSync(resolve(root, "dist/icons.svg"), "utf8");

const cssClasses = new Set(
  [...css.matchAll(/\.(ro-[a-z0-9]+(?:[-_]{1,2}[a-z0-9]+)*)/g)].map((m) => m[1]),
);
const iconIds = new Set(
  [...sprite.matchAll(/id="(ro-i-[a-z0-9-]+)"/g)].map((m) => m[1]),
);

function snippetProblems(html) {
  const problems = [];
  const { document } = new JSDOM(`<body>${html}</body>`).window;
  for (const el of document.body.querySelectorAll("*")) {
    for (const cls of el.classList) {
      if (cls.startsWith("ro-") && !cssClasses.has(cls)) {
        problems.push(`clase inexistente: .${cls}`);
      }
    }
  }
  for (const use of document.body.querySelectorAll("use[href]")) {
    const href = use.getAttribute("href") || "";
    if (href.startsWith("#ro-i-")) {
      const id = href.slice(1);
      if (!iconIds.has(id)) problems.push(`icono inexistente: ${href}`);
    }
  }
  return problems;
}

const files = existsSync(manifestDir)
  ? readdirSync(manifestDir).filter((f) => f.endsWith(".json"))
  : [];

let failures = 0;
let snippets = 0;
for (const file of files) {
  const m = JSON.parse(readFileSync(resolve(manifestDir, file), "utf8"));
  const fields = [["anatomy", m.anatomy?.html]];
  (m.examples || []).forEach((ex, i) => fields.push([`examples[${i}] "${ex.title}"`, ex.html]));
  for (const [label, html] of fields) {
    if (!html) continue;
    snippets += 1;
    const problems = snippetProblems(html);
    if (problems.length) {
      failures += problems.length;
      console.error(`✗ ${m.name} · ${label}`);
      for (const p of problems) console.error(`    ${p}`);
    }
  }
}

if (failures > 0) {
  console.error(`\nEjemplos con divergencias: ${failures} problema(s).`);
  process.exit(1);
}
console.log(`Ejemplos verificados: ${snippets} snippet(s) en ${files.length} componente(s), sin divergencias.`);
