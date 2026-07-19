#!/usr/bin/env node
/**
 * Generador de la referencia por componente (F5-001).
 *
 * Fuente: docs/reference/components/*.json (un manifiesto por componente).
 * Salida: docs/reference/<name>.html (una pagina por componente) y
 * docs/reference/index.html (indice agrupado por familia con badges de madurez).
 *
 * Modos:
 *   node scripts/build-reference.mjs           → escribe las paginas
 *   node scripts/build-reference.mjs --check    → falla si el HTML difiere del
 *                                                 generado (guarda contra drift)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const refDir = resolve(root, "docs/reference");
const manifestDir = resolve(refDir, "components");
const a11yDir = resolve(root, "docs/accessibility");
const check = process.argv.includes("--check");

// Familias y orden segun docs/inventory/components.md.
const GROUPS = [
  ["Fundamentos visuales", ["typography", "icon", "divider", "code", "prose"]],
  ["Acciones", ["button", "button-group", "toolbar"]],
  ["Formularios", ["form", "input-group", "number-input", "slider", "rating", "file-upload", "tags-input"]],
  ["Seleccion y navegacion", ["nav", "segmented", "pagination", "breadcrumb", "sidebar", "tree", "list-group"]],
  ["Overlays", ["modal", "drawer", "popover", "tooltip", "menu", "command-palette"]],
  ["Datos y estado", ["table", "badge", "tag", "progress", "progress-ring", "spinner", "skeleton"]],
  ["Feedback", ["alert", "toast", "banner", "empty"]],
  ["Contenido y estructura", ["card", "avatar", "header", "footer", "description-list", "timeline"]],
  ["Disclosure", ["accordion", "stepper"]],
  ["Fecha y entrada compleja", ["calendar", "combobox"]],
];

const MATURITY = new Set(["experimental", "beta", "stable", "deprecated"]);

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

function validate(m, file) {
  const req = ["name", "title", "group", "maturity", "summary", "anatomy", "api", "a11y"];
  for (const k of req) {
    if (m[k] == null) throw new Error(`${file}: falta el campo obligatorio "${k}"`);
  }
  if (!MATURITY.has(m.maturity)) throw new Error(`${file}: madurez invalida "${m.maturity}"`);
  if (!m.anatomy.html) throw new Error(`${file}: anatomy.html es obligatorio`);
  if (!m.a11y.contract) throw new Error(`${file}: a11y.contract es obligatorio`);
}

function head(title, depth) {
  const up = depth; // ruta relativa hacia docs/
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} — RoUI DS</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${up}../dist/roui.css">
  <link rel="stylesheet" href="${up}assets/docs.css">
</head>`;
}

function nav(active, depth) {
  const a = (href, label, key) =>
    `<a href="${depth}${href}"${active === key ? ' class="is-active"' : ""}>${label}</a>`;
  return `<aside class="dx-nav">
  <div class="dx-brand">RoUI<span>.</span></div>
  <div class="dx-nav-group"><h4>Inicio</h4>${a("index.html", "Introducción", "")}</div>
  <div class="dx-nav-group"><h4>Fundamentos</h4>${a("tokens.html", "Tokens / Variables", "")}${a("icons.html", "Iconos", "")}${a("layouts.html", "Layouts &amp; Grid", "")}</div>
  <div class="dx-nav-group"><h4>Componentes</h4>${a("components.html", "Galería", "")}<a href="${depth}reference/index.html"${active === "reference" ? ' class="is-active"' : ""}>Referencia</a></div>
  <div class="dx-nav-group"><h4>Plantillas</h4>${a("templates/dashboard.html", "Dashboard", "")}${a("templates/module-3col.html", "Módulo (3 columnas)", "")}</div>
</aside>`;
}

function badge(maturity) {
  return `<span class="dx-ref-badge dx-ref-badge--${maturity}">${maturity}</span>`;
}

function list(items) {
  return `<ul class="dx-ref-list">${(items || []).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
}

function example(ex) {
  return `<div class="dx-ref-example">
  <div class="dx-ref-example__head">${esc(ex.title)}</div>
  <div class="dx-demo">${ex.html}</div>
  <pre class="dx-ref-code"><code>${esc(ex.html)}</code></pre>
</div>`;
}

function apiSection(api) {
  const parts = [];
  if (api.classes && api.classes.length) {
    parts.push(`<h3>Clases</h3><table class="dx-table"><thead><tr><th>Clase</th><th>Descripción</th></tr></thead><tbody>${
      api.classes.map((c) => `<tr><td><code>.${esc(c.name)}</code></td><td>${esc(c.desc)}</td></tr>`).join("")
    }</tbody></table>`);
  }
  if (api.data && api.data.length) {
    parts.push(`<h3>Atributos data</h3><table class="dx-table"><thead><tr><th>Atributo</th><th>Descripción</th></tr></thead><tbody>${
      api.data.map((d) => `<tr><td><code>${esc(d.name)}</code></td><td>${esc(d.desc)}</td></tr>`).join("")
    }</tbody></table>`);
  }
  if (api.tokens && api.tokens.length) {
    parts.push(`<h3>Tokens que consume</h3><p class="dx-ref-tokens">${
      api.tokens.map((t) => `<code>${esc(t)}</code>`).join(" ")
    }</p>`);
  }
  if (api.primitive) {
    const p = api.primitive;
    parts.push(`<h3>Primitiva</h3><pre class="dx-ref-code"><code>${esc("import { " + p.import + " } from \"@robertcastro/roui/primitives/" + p.module + "\";")}</code></pre>`);
  } else {
    parts.push(`<p class="dx-ref-note">Sin JavaScript: es CSS sobre HTML nativo.</p>`);
  }
  return parts.join("\n");
}

function keyboard(a11y) {
  const rows = (a11y.keyboard || []).map((k) => `<tr><td><kbd>${esc(k[0])}</kbd></td><td>${esc(k[1])}</td></tr>`).join("");
  const table = rows
    ? `<table class="dx-table"><thead><tr><th>Tecla</th><th>Acción</th></tr></thead><tbody>${rows}</tbody></table>`
    : "";
  const href = a11y.contract.replace(/\.md$/, ".html");
  const label = a11y.contract.replace("accessibility/", "").replace(/\.md$/, "");
  return `${table}<p class="dx-ref-note">Contrato de accesibilidad: <a href="../${esc(href)}">${esc(label)}</a></p>${list(a11y.notes)}`;
}

function page(m) {
  const dodont = m.dodont || { do: [], dont: [] };
  const related = (m.related || []).map((r) => `<a href="${esc(r)}.html">${esc(r)}</a>`).join(" · ");
  return `${head(m.title, "../")}
<body class="ro-root">
  <div class="dx">
    ${nav("reference", "../")}
    <main class="dx-main">
      <p class="dx-eyebrow">${esc(m.group)}</p>
      <div class="dx-ref-title"><h1>${esc(m.title)}</h1>${badge(m.maturity)}</div>
      <p class="dx-lead">${esc(m.summary)}</p>

      <section class="dx-section" aria-label="Cuándo usarlo">
        <h2>Cuándo usarlo</h2>
        ${list(m.whenToUse)}
        ${m.whenNotToUse && m.whenNotToUse.length ? `<h3>Cuándo no</h3>${list(m.whenNotToUse)}` : ""}
      </section>

      <section class="dx-section" aria-label="Anatomía">
        <h2>Anatomía</h2>
        <pre class="dx-ref-code"><code>${esc(m.anatomy.html)}</code></pre>
        ${list(m.anatomy.notes)}
      </section>

      <section class="dx-section" aria-label="API">
        <h2>API</h2>
        ${apiSection(m.api)}
      </section>

      <section class="dx-section" aria-label="Teclado y accesibilidad">
        <h2>Teclado y accesibilidad</h2>
        ${keyboard(m.a11y)}
      </section>

      <section class="dx-section" aria-label="Ejemplos">
        <h2>Ejemplos</h2>
        ${(m.examples || []).map(example).join("\n")}
      </section>

      <section class="dx-section" aria-label="Buenas prácticas">
        <h2>Do / Don't</h2>
        <div class="dx-ref-dodont">
          <div class="dx-ref-do"><h3>Sí</h3>${list(dodont.do)}</div>
          <div class="dx-ref-dont"><h3>No</h3>${list(dodont.dont)}</div>
        </div>
      </section>

      ${related ? `<section class="dx-section" aria-label="Relacionados"><h2>Relacionados</h2><p class="dx-ref-related">${related}</p></section>` : ""}
    </main>
  </div>
  <script>
    fetch(new URL("../../dist/icons.svg", document.baseURI).href).then(function (r) { return r.ok ? r.text() : ""; }).then(function (svg) { if (!svg) return; var d = document.createElement("div"); d.style.display = "none"; d.innerHTML = svg; document.body.insertBefore(d, document.body.firstChild); });
  </script>
</body>
</html>
`;
}

function indexPage(byName, contractFiles = []) {
  const contracts = contractFiles.length
    ? `<section class="dx-section" aria-label="Contratos de accesibilidad"><h2>Contratos de accesibilidad</h2><div class="dx-ref-grid">${
        contractFiles.map((f) => {
          const name = basename(f, ".md");
          return `<a class="dx-ref-card" href="../accessibility/${esc(name)}.html"><span class="dx-ref-card__name">${esc(name.replace(/-/g, " "))}</span></a>`;
        }).join("")
      }</div></section>`
    : "";
  const groups = GROUPS.map(([name, comps]) => {
    const cards = comps.map((c) => {
      const m = byName.get(c);
      const status = m ? "" : ' <span class="dx-ref-pending">pendiente</span>';
      const title = m ? m.title : c;
      const mat = m ? badge(m.maturity) : "";
      const inner = `<span class="dx-ref-card__name">${esc(title)}</span>${mat}${status}`;
      return m
        ? `<a class="dx-ref-card" href="${esc(c)}.html">${inner}</a>`
        : `<div class="dx-ref-card dx-ref-card--pending">${inner}</div>`;
    }).join("");
    return `<section class="dx-section" aria-label="${esc(name)}"><h2>${esc(name)}</h2><div class="dx-ref-grid">${cards}</div></section>`;
  }).join("\n");
  const total = GROUPS.reduce((a, [, c]) => a + c.length, 0);
  const done = byName.size;
  return `${head("Referencia", "../")}
<body class="ro-root">
  <div class="dx">
    ${nav("reference", "../")}
    <main class="dx-main">
      <h1>Referencia de componentes</h1>
      <p class="dx-lead">Contrato, API, teclado y ejemplos por componente. ${done} de ${total} documentados.</p>
      ${groups}
      ${contracts}
    </main>
  </div>
</body>
</html>
`;
}

function contractPage(name, md) {
  const body = marked.parse(md, { mangle: false, headerIds: false });
  return `${head("Accesibilidad", "../")}
<body class="ro-root">
  <div class="dx">
    ${nav("reference", "../")}
    <main class="dx-main">
      <p class="dx-eyebrow">Accesibilidad</p>
      <article class="ro-prose dx-ref-contract">
${body}
      </article>
    </main>
  </div>
</body>
</html>
`;
}

// --- Ejecucion ---
const files = existsSync(manifestDir)
  ? readdirSync(manifestDir).filter((f) => f.endsWith(".json"))
  : [];
const manifests = files.map((f) => {
  const m = JSON.parse(readFileSync(resolve(manifestDir, f), "utf8"));
  validate(m, f);
  return m;
});
const byName = new Map(manifests.map((m) => [m.name, m]));

const contractFiles = existsSync(a11yDir)
  ? readdirSync(a11yDir).filter((f) => f.endsWith(".md")).sort()
  : [];

const outputs = new Map();
for (const m of manifests) outputs.set(resolve(refDir, `${m.name}.html`), page(m));
outputs.set(resolve(refDir, "index.html"), indexPage(byName, contractFiles));
for (const f of contractFiles) {
  outputs.set(resolve(a11yDir, f.replace(/\.md$/, ".html")), contractPage(f, readFileSync(resolve(a11yDir, f), "utf8")));
}

let drift = 0;
for (const [path, html] of outputs) {
  if (check) {
    const current = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (current !== html) { drift += 1; console.error(`✗ desactualizado: ${path.replace(root + "/", "")}`); }
  } else {
    writeFileSync(path, html);
  }
}

if (check) {
  if (drift > 0) {
    console.error(`\nReferencia desactualizada en ${drift} archivo(s). Corre "npm run build:reference".`);
    process.exit(1);
  }
  console.log(`Referencia sincronizada: ${manifests.length} componente(s) + índice.`);
} else {
  console.log(`✓ Referencia generada: ${manifests.length} componente(s) + índice (${dirname(refDir).length ? "docs/reference/" : ""}).`);
}
