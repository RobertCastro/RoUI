#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourcePath = resolve(root, "tokens/tokens.json");
const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const allowedFiles = new Set(["colors", "typography", "spacing", "effects", "layout"]);
const tokens = new Map();

if (source.$schema !== "https://design-tokens.github.io/community-group/format/") {
  throw new Error("La fuente de tokens debe declarar el schema DTCG");
}

function collect(node, path = [], inherited = {}) {
  const metadata = { ...inherited, ...(node.$extensions?.["org.roui"] ?? {}) };
  if (Object.hasOwn(node, "$value")) {
    const cssVariable = metadata.cssVariable ?? `--ro-${path.at(-1)}`;
    if (!node.$type || !allowedFiles.has(metadata.cssFile)) {
      throw new Error(`Token invalido: ${path.join(".")}`);
    }
    const id = path.join(".");
    if (Object.hasOwn(node, "value")) throw new Error(`Clave legacy value en ${id}`);
    if (tokens.has(id)) throw new Error(`Token duplicado: ${id}`);
    tokens.set(id, { id, value: node.$value, type: node.$type, ...metadata, cssVariable });
    return;
  }
  for (const [key, value] of Object.entries(node)) {
    if (!key.startsWith("$")) collect(value, [...path, key], metadata);
  }
}
collect(source);

const variables = new Map([...tokens.values()].map((token) => [token.cssVariable, token.id]));
if (variables.size !== tokens.size) throw new Error("Variables CSS duplicadas");

function resolveAlias(value, stack = []) {
  const match = typeof value === "string" && value.match(/^\{([^}]+)\}$/);
  if (!match) return value;
  const target = tokens.get(match[1]);
  if (!target) throw new Error(`Referencia inexistente: ${match[1]}`);
  if (stack.includes(target.id)) throw new Error(`Referencia circular: ${[...stack, target.id].join(" -> ")}`);
  return resolveAlias(target.value, [...stack, target.id]);
}

function cssValue(token) {
  const match = typeof token.value === "string" && token.value.match(/^\{([^}]+)\}$/);
  if (!match) return token.value;
  const target = tokens.get(match[1]);
  if (!target) throw new Error(`Referencia inexistente: ${match[1]}`);
  return `var(${target.cssVariable})`;
}

function value(id) {
  const token = tokens.get(id);
  if (!token) throw new Error(`Token requerido no encontrado: ${id}`);
  return resolveAlias(token.value);
}

function fontFamily(id) {
  return value(id).split(",").map((item) => item.trim().replace(/^"|"$/g, ""));
}

function cssFile(file) {
  const entries = [...tokens.values()]
    .filter((token) => token.cssFile === file)
    .sort((a, b) => a.cssVariable.localeCompare(b.cssVariable));
  return [
    "/* Generado desde tokens/tokens.json. No editar a mano. */",
    ":root {",
    ...entries.map((token) => `  ${token.cssVariable}: ${cssValue(token)};`),
    "}",
    "",
  ].join("\n");
}

const tailwind = {
  theme: {
    extend: {
      colors: Object.fromEntries([
        ["ink", "colors.ink"], ["ink-soft", "colors.ink-soft"],
        ["primary", "colors.primary"], ["secondary", "colors.secondary"],
        ["graybrand", "colors.gray"], ["sky", "colors.sky"],
        ["success", "colors.success"], ["warning", "colors.warning"],
        ["error", "colors.error"], ["info", "colors.info"],
      ].map(([name, id]) => [name, value(id)])),
      fontFamily: {
        display: fontFamily("typography.font-display"),
        sans: fontFamily("typography.font-sans"),
        mono: fontFamily("typography.font-mono"),
      },
      fontSize: {
        display: [value("typography.text-display"), {
          lineHeight: value("typography.leading-tight"),
          letterSpacing: value("typography.tracking-tight"),
        }],
      },
      letterSpacing: Object.fromEntries([
        ["tight", "typography.tracking-tight"], ["wide", "typography.tracking-wide"],
        ["wider", "typography.tracking-wider"],
      ].map(([name, id]) => [name, value(id)])),
      borderRadius: Object.fromEntries([
        ["card", "spacing.radius-card"], ["banner", "spacing.radius-banner"],
      ].map(([name, id]) => [name, value(id)])),
      boxShadow: Object.fromEntries([
        ["brand-sm", "effects.shadow-sm"], ["brand-md", "effects.shadow-md"],
        ["focus", "effects.focus-ring"],
      ].map(([name, id]) => [name, value(id)])),
      transitionTimingFunction: { "brand-out": value("effects.ease-out") },
      spacing: Object.fromEntries([
        ["header", "layout.header-h"], ["subheader", "layout.subheader-h"],
        ["rail-left", "layout.rail-left"], ["rail-right", "layout.rail-right"],
      ].map(([name, id]) => [name, value(id)])),
      maxWidth: { content: value("layout.content-max") },
      gridTemplateColumns: {
        "3col": `${value("layout.rail-left")} minmax(0,1fr) ${value("layout.rail-right")}`,
        "2col": `minmax(0,1fr) ${value("layout.rail-right")}`,
      },
      zIndex: Object.fromEntries([
        ["header", "layout.z-header"], ["overlay", "layout.z-overlay"], ["modal", "layout.z-modal"],
      ].map(([name, id]) => [name, String(value(id))])),
    },
  },
};

const outputs = new Map([
  ...["colors", "typography", "spacing", "effects", "layout"].map((file) => [
    resolve(root, `src/tokens/${file}.css`), cssFile(file),
  ]),
  [
    resolve(root, "tokens/tailwind.preset.cjs"),
    `/** Generado desde tokens/tokens.json. No editar a mano. */\nmodule.exports = ${JSON.stringify(tailwind, null, 2)};\n`,
  ],
]);

const check = process.argv.includes("--check");
const stale = [];
for (const [path, content] of outputs) {
  const current = readFileSync(path, "utf8");
  if (current !== content) stale.push(path.replace(`${root}/`, ""));
  if (!check) writeFileSync(path, content);
}
if (stale.length) {
  const message = `Artefactos de tokens desactualizados: ${stale.join(", ")}`;
  if (check) throw new Error(message);
  console.log(`✓ ${message}`);
}
console.log(`✓ ${tokens.size} tokens validados y ${outputs.size} artefactos generados`);
