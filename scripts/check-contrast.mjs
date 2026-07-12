#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const source = JSON.parse(readFileSync(resolve(root, "tokens/tokens.json"), "utf8"));
const tokens = new Map();

function collect(node, path = [], inherited = {}) {
  const metadata = { ...inherited, ...(node.$extensions?.["org.roui"] ?? {}) };
  if (Object.hasOwn(node, "$value")) {
    tokens.set(path.join("."), { id: path.join("."), value: node.$value, cssVariable: metadata.cssVariable ?? `--ro-${path.at(-1)}` });
    return;
  }
  for (const [key, value] of Object.entries(node)) if (!key.startsWith("$")) collect(value, [...path, key], metadata);
}
collect(source);

const baseVariables = new Map([...tokens.values()].filter((token) => !token.id.startsWith("themes.")).map((token) => [token.cssVariable, token]));
const aliasId = (value) => typeof value === "string" ? value.match(/^\{([^}]+)\}$/)?.[1] : undefined;

function resolveValue(value, overrides, stack = []) {
  const id = aliasId(value);
  if (!id) return value;
  const token = tokens.get(id);
  if (!token) throw new Error(`Alias inexistente: ${id}`);
  if (stack.includes(token.id)) throw new Error(`Alias circular: ${[...stack, token.id].join(" -> ")}`);
  const override = overrides.get(token.cssVariable);
  const inheritedAlias = override === `{${token.id}}`;
  return resolveValue(inheritedAlias ? token.value : (override ?? token.value), overrides, [...stack, token.id]);
}

function resolveVariable(variable, overrides) {
  const token = baseVariables.get(variable);
  if (!token && !overrides.has(variable)) throw new Error(`Variable inexistente: ${variable}`);
  return resolveValue(overrides.get(variable) ?? token.value, overrides);
}

function luminance(hex) {
  const raw = hex.slice(1);
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(raw)) throw new Error(`Color no hexagonal para contraste: ${hex}`);
  const expanded = raw.length === 3 ? raw.split("").map((char) => char + char).join("") : raw;
  return [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16) / 255)
    .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4)
    .reduce((total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index], 0);
}

function ratio(first, second) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

const pairs = [["page", "--ro-bg", "--ro-text"], ["surface", "--ro-surface", "--ro-text"], ["button-primary", "--ro-button-primary-bg", "--ro-button-primary-fg"], ["button-dark", "--ro-button-dark-bg", "--ro-button-dark-fg"], ["control", "--ro-control-bg", "--ro-control-fg"]];
let failures = 0;
for (const theme of ["light", "dark", "high-contrast"]) {
  const overrides = new Map([...tokens.values()].filter((token) => token.id.startsWith(`themes.${theme}.`)).map((token) => [token.cssVariable, token.value]));
  for (const [name, backgroundVariable, foregroundVariable] of pairs) {
    const background = resolveVariable(backgroundVariable, overrides);
    const foreground = resolveVariable(foregroundVariable, overrides);
    const value = ratio(background, foreground);
    console.log(`${theme}/${name}: ${value.toFixed(2)}:1`);
    if (value < 4.5) { console.error(`Contraste insuficiente para ${theme}/${name}: ${background} y ${foreground}`); failures += 1; }
  }
}
if (failures) process.exitCode = 1;
