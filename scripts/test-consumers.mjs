#!/usr/bin/env node
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixtureRoot = resolve(root, "fixtures");
const tempRoot = mkdtempSync(join(tmpdir(), "roui-consumers-"));
const npmCache = join(tmpdir(), "roui-npm-cache");

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: npmCache },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} fallo con codigo ${result.status}`);
  }
  return result.stdout;
}

function onlyFile(directory, extension) {
  const files = readdirSync(directory, { recursive: true })
    .filter((file) => file.endsWith(extension));
  if (files.length !== 1) throw new Error(`Se esperaba un ${extension} en ${directory}`);
  return join(directory, files[0]);
}

try {
  run("npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", tempRoot]);
  const tarball = onlyFile(tempRoot, ".tgz");
  const consumers = join(tempRoot, "fixtures");
  cpSync(fixtureRoot, consumers, { recursive: true });

  for (const name of ["esbuild-vanilla", "tailwind"]) {
    const fixture = join(consumers, name);
    run("npm", [
      "install", "--ignore-scripts", "--no-package-lock", "--no-save",
      "--no-audit", "--no-fund", tarball,
    ], fixture);
  }

  const esbuild = resolve(root, "node_modules/.bin/esbuild");
  const esbuildFixture = join(consumers, "esbuild-vanilla");
  run(esbuild, ["main.js", "--bundle", "--outdir=dist", "--loader:.svg=file"], esbuildFixture);
  const esbuildCss = readFileSync(onlyFile(join(esbuildFixture, "dist"), ".css"), "utf8");
  if (!esbuildCss.includes(".ro-btn")) throw new Error("esbuild no incorporo el componente button");

  const tailwind = resolve(root, "node_modules/.bin/tailwindcss");
  const tailwindFixture = join(consumers, "tailwind");
  run(tailwind, ["-i", "input.css", "-o", "dist/tailwind.css", "--minify"], tailwindFixture);
  const tailwindCss = readFileSync(join(tailwindFixture, "dist/tailwind.css"), "utf8");
  for (const selector of [".text-ink", ".font-display", ".shadow-focus"]) {
    if (!tailwindCss.includes(selector)) throw new Error(`Tailwind no genero ${selector}`);
  }

  console.log("Fixtures consumidoras: esbuild vanilla y Tailwind compilaron correctamente");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
