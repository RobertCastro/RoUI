#!/usr/bin/env node
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixture = mkdtempSync(join(tmpdir(), "roui-consumer-"));

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: join(tmpdir(), "roui-npm-cache") },
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    throw new Error(`${command} ${args.join(" ")} fallo con codigo ${result.status}`);
  }
  return result.stdout;
}

try {
  run("npm", [
    "pack",
    "--json",
    "--ignore-scripts",
    "--pack-destination",
    fixture,
  ]);
  const filename = readdirSync(fixture).find((name) => name.endsWith(".tgz"));
  if (!filename) throw new Error("npm pack no genero un tarball");
  const tarball = join(fixture, filename);

  writeFileSync(
    join(fixture, "package.json"),
    JSON.stringify({ name: "roui-package-fixture", private: true }),
  );
  run("npm", [
    "install",
    "--ignore-scripts",
    "--no-package-lock",
    "--no-audit",
    "--no-fund",
    tarball,
  ], fixture);

  writeFileSync(
    join(fixture, "verify.cjs"),
    `const assert = require("node:assert/strict");
const preset = require("@robertcastro/roui/tailwind");
assert.equal(preset.theme.extend.colors.ink, "#171719");
assert.equal(preset.theme.extend.spacing.header, "72px");
import("@robertcastro/roui/tailwind").then((module) => {
  assert.equal(module.default.theme.extend.colors.primary, "#f6f072");
  console.log("Tailwind entrypoint: CJS require + ESM import correctos");
}).catch((error) => { console.error(error); process.exitCode = 1; });
`,
  );
  process.stdout.write(run(process.execPath, ["verify.cjs"], fixture));
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
