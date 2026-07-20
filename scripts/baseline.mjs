#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const src = resolve(root, "src");

function walk(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) return walk(path, extension);
    return entry.name.endsWith(extension) ? [path] : [];
  });
}

const cssFiles = walk(src, ".css");
const componentFiles = cssFiles.filter((file) => file.includes("/components/"));
const indexPath = resolve(src, "index.css");
const index = readFileSync(indexPath, "utf8");
const imports = [...index.matchAll(
  /@import\s+["']\.\/(.+?)["'](?:\s+layer\(([^)]+)\))?;/g,
)].map((match) => match[1]);
const duplicateImports = imports.filter((item, index) => imports.indexOf(item) !== index);
const missingImports = imports.filter((file) => {
  try {
    return !statSync(resolve(src, file)).isFile();
  } catch {
    return true;
  }
});

const allCss = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
const definedCustomProperties = new Set(
  [...allCss.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)].map((m) => m[1]),
);
const usedCustomProperties = new Set(
  [...allCss.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map((m) => m[1]),
);
const undefinedCustomProperties = [...usedCustomProperties]
  .filter((token) => !definedCustomProperties.has(token))
  .sort();

const icons = JSON.parse(readFileSync(resolve(src, "icons/icons.json"), "utf8")).icons;
const literalColorMatches = [...allCss.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)];
const literalPixelMatches = [...allCss.matchAll(/\b\d+(?:\.\d+)?px\b/g)];
const bytes = cssFiles.reduce((total, file) => total + statSync(file).size, 0);

const report = {
  generatedAt: new Date().toISOString(),
  source: {
    cssFiles: cssFiles.length,
    componentFiles: componentFiles.length,
    indexImports: imports.length,
    cssBytes: bytes,
    icons: Object.keys(icons).length,
    customPropertiesDefined: definedCustomProperties.size,
  },
  debtIndicators: {
    literalColors: literalColorMatches.length,
    literalPixelValues: literalPixelMatches.length,
    note: "Indicadores de migracion; incluyen definiciones legitimas de tokens.",
  },
  structuralErrors: {
    duplicateImports: [...new Set(duplicateImports)],
    missingImports,
    undefinedCustomProperties,
  },
  knownIssues: [
    "Fase 7 depende de seleccionar y ejecutar un producto piloto real.",
    "Trabajo continuo: completar manifiestos de referencia, tematizacion de demos, reflow de plantillas y documentacion multi-version.",
  ],
};

console.log(JSON.stringify(report, null, 2));

const structuralErrorCount = Object.values(report.structuralErrors)
  .reduce((total, entries) => total + entries.length, 0);
if (structuralErrorCount > 0) {
  console.error(`Baseline fallo con ${structuralErrorCount} errores estructurales.`);
  process.exitCode = 1;
}
