#!/usr/bin/env node
/* Build sin dependencias: concatena src/ en orden → dist/roui.css (+ .min.css)
   Lee la lista de @import desde src/index.css para mantener una sola fuente de orden. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcDir = resolve(root, "src");
const distDir = resolve(root, "dist");
mkdirSync(distDir, { recursive: true }); // crea dist/ si no existe (checkout limpio / CI)
const index = readFileSync(resolve(srcDir, "index.css"), "utf8");

const files = [...index.matchAll(/@import\s+["']\.\/(.+?)["'];/g)].map((m) => m[1]);

let out = `/*! RoUI Design System — bundle generado. No editar a mano. */\n`;
for (const f of files) {
  const css = readFileSync(resolve(srcDir, f), "utf8");
  out += `\n/* ===== ${f} ===== */\n${css.trim()}\n`;
}

writeFileSync(resolve(distDir, "roui.css"), out);

// "min" simple (quita comentarios y espacios redundantes; suficiente para distribuir)
const min = out
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{}:;,>])\s*/g, "$1")
  .replace(/;}/g, "}")
  .trim();
writeFileSync(resolve(distDir, "roui.min.css"), min);

console.log(`✓ dist/roui.css (${files.length} archivos, ${(out.length/1024).toFixed(1)} KB)`);
console.log(`✓ dist/roui.min.css (${(min.length/1024).toFixed(1)} KB)`);

/* --- Sprite de iconos: src/icons/icons.json → dist/icons.svg --- */
const iconsData = JSON.parse(readFileSync(resolve(srcDir, "icons/icons.json"), "utf8")).icons;
const symbols = Object.entries(iconsData)
  .map(([name, paths]) =>
    `  <symbol id="ro-i-${name}" viewBox="0 0 24 24">${paths.replace(/'/g, '"')}</symbol>`)
  .join("\n");
const sprite =
`<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
<!-- RoUI icon sprite (Lucide, MIT). Uso: <svg class="ro-icon"><use href="icons.svg#ro-i-bell"/></svg> -->
${symbols}
</svg>
`;
writeFileSync(resolve(distDir, "icons.svg"), sprite);
console.log(`✓ dist/icons.svg (${Object.keys(iconsData).length} iconos)`);
