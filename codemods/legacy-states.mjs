#!/usr/bin/env node
/**
 * Codemod: estados de clase heredados -> atributos ARIA (F7-003).
 *
 * RoUI dirige los estados desde la semántica, no desde clases. Este codemod
 * reemplaza las clases modificadoras de estado específicas de RoUI por su
 * atributo equivalente, de forma quirúrgica (preserva el resto del marcado).
 *
 * Uso:
 *   node codemods/legacy-states.mjs <archivo|glob> [...]     # dry-run (informa)
 *   node codemods/legacy-states.mjs <archivo|glob> [...] --write
 *
 * Cubre solo las transformaciones deterministas. Los cambios de comportamiento
 * (paneles con `is-open`, listbox que abre/cierra) se migran a mano; ver la guía
 * de migración.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

// token de clase -> atributo a añadir en el mismo elemento.
export const RULES = [
  { token: "ro-tab--active", attr: 'aria-selected="true"' },
  { token: "ro-nav-link--active", attr: 'aria-current="page"' },
  { token: "ro-calendar__day--selected", attr: 'aria-selected="true"' },
  { token: "ro-breadcrumbs__current--active", attr: 'aria-current="page"' },
];

/** Aplica una regla a un elemento cuyo `class` contiene el token. */
function apply(html, rule) {
  let count = 0;
  const re = new RegExp(`class="([^"]*\\b${rule.token}\\b[^"]*)"`, "g");
  const out = html.replace(re, (match, cls) => {
    const cleaned = cls.split(/\s+/).filter((c) => c && c !== rule.token).join(" ");
    count += 1;
    const attrName = rule.attr.split("=")[0];
    // Evita duplicar el atributo si el bloque ya lo trae cerca (idempotencia básica).
    return `class="${cleaned}" ${rule.attr}`.replace(new RegExp(` ${attrName}="[^"]*"( ${attrName}="[^"]*")`), "$1");
  });
  return { out, count };
}

/** Migra todas las reglas sobre una cadena HTML. Devuelve el resultado y el total. */
export function migrate(html) {
  let out = html;
  let count = 0;
  for (const rule of RULES) {
    const r = apply(out, rule);
    out = r.out;
    count += r.count;
  }
  return { out, count };
}

// Ejecuta la CLI solo cuando se invoca directamente (no al importarse en pruebas).
if (import.meta.url === `file://${process.argv[1]}`) cli();

function cli() {
const args = process.argv.slice(2);
const write = args.includes("--write");
const files = args.filter((a) => a !== "--write");

if (files.length === 0) {
  console.error("Uso: node codemods/legacy-states.mjs <archivo> [...] [--write]");
  process.exit(1);
}

let totalChanges = 0;
let changedFiles = 0;

for (const file of files) {
  if (!existsSync(file)) { console.error(`✗ no existe: ${file}`); continue; }
  const original = readFileSync(file, "utf8");
  let html = original;
  let fileChanges = 0;
  const perRule = [];
  for (const rule of RULES) {
    const { out, count } = apply(html, rule);
    html = out;
    if (count) { fileChanges += count; perRule.push(`${rule.token} → ${rule.attr.split("=")[0]} (${count})`); }
  }
  if (fileChanges === 0) continue;
  changedFiles += 1;
  totalChanges += fileChanges;
  console.log(`${write ? "✓" : "•"} ${file}: ${fileChanges} cambio(s) — ${perRule.join(", ")}`);
  if (write) writeFileSync(file, html);
}

if (totalChanges === 0) {
  console.log("Sin patrones heredados que migrar.");
} else if (!write) {
  console.log(`\n${totalChanges} cambio(s) en ${changedFiles} archivo(s). Repite con --write para aplicarlos.`);
} else {
  console.log(`\nAplicados ${totalChanges} cambio(s) en ${changedFiles} archivo(s).`);
}
}
