#!/usr/bin/env node
/* Build sin dependencias: concatena src/ en orden → dist/roui.css (+ .min.css)
   Lee la lista de @import desde src/index.css para mantener una sola fuente de orden. */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcDir = resolve(root, "src");
const distDir = resolve(root, "dist");
execFileSync(process.execPath, [resolve(root, "scripts/build-tokens.mjs")], { stdio: "inherit" });
mkdirSync(distDir, { recursive: true }); // crea dist/ si no existe (checkout limpio / CI)
const index = readFileSync(resolve(srcDir, "index.css"), "utf8");

const imports = [...index.matchAll(
  /@import\s+["']\.\/(.+?)["'](?:\s+layer\(([^)]+)\))?;/g,
)].map((match) => ({ file: match[1], layer: match[2] }));

let out = `/*! RoUI Design System — bundle generado. No editar a mano. */\n`;
out += `@layer roui.tokens, roui.reset, roui.base, roui.layouts, roui.components, roui.utilities;\n`;
for (const { file, layer } of imports) {
  const css = readFileSync(resolve(srcDir, file), "utf8");
  const content = layer ? `@layer ${layer} {\n${css.trim()}\n}` : css.trim();
  out += `\n/* ===== ${file} ===== */\n${content}\n`;
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

console.log(`✓ dist/roui.css (${imports.length} archivos, ${(out.length/1024).toFixed(1)} KB)`);
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

/* --- Primitivas de comportamiento publicas --- */
const primitivesDir = resolve(distDir, "primitives");
mkdirSync(primitivesDir, { recursive: true });
const primitiveFiles = readdirSync(resolve(srcDir, "primitives"))
  .filter((file) => file.endsWith(".js"));
for (const file of primitiveFiles) {
  buildSync({
    entryPoints: [resolve(srcDir, "primitives", file)],
    outfile: resolve(primitivesDir, file),
    bundle: true,
    format: "esm",
    minify: true,
    platform: "browser",
    target: "es2020",
    legalComments: "none",
  });
  console.log(`✓ dist/primitives/${file}`);
}
