#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = resolve(root, "src");
const expectedDigest = "423702225cb0e28ca717941e759a6e3370ca64c1be75f58ad28c24629852b27a";

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return entry.name === "tokens" ? [] : walk(path);
    return entry.name.endsWith(".css") ? [path] : [];
  });
}

const patterns = [
  ["color", /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g],
  ["pixel", /\b\d+(?:\.\d+)?px\b/g],
];
const occurrences = [];
for (const file of walk(source)) {
  const css = readFileSync(file, "utf8");
  for (const [kind, pattern] of patterns) {
    for (const match of css.matchAll(pattern)) {
      const line = css.slice(0, match.index).split("\n").length;
      occurrences.push(`${kind}:${relative(root, file)}:${line}:${match[0]}`);
    }
  }
}
occurrences.sort();
const digest = createHash("sha256").update(occurrences.join("\n")).digest("hex");
const totals = Object.fromEntries(patterns.map(([kind]) => [kind, occurrences.filter((entry) => entry.startsWith(`${kind}:`)).length]));
console.log(`Literales fuera de tokens: ${totals.color} colores, ${totals.pixel} valores px`);
console.log(`Inventario SHA-256: ${digest}`);
if (digest !== expectedDigest) {
  throw new Error("El inventario de literales cambió; migra el valor a un token o actualiza la excepción documentada.");
}
