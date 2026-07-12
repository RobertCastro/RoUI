#!/usr/bin/env node
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const temp = mkdtempSync(join(tmpdir(), "roui-size-"));
const limits = { packed: 64 * 1024, unpacked: 272 * 1024 };

try {
  const result = spawnSync("npm", [
    "pack", "--json", "--ignore-scripts", "--pack-destination", temp,
  ], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, npm_config_cache: join(tmpdir(), "roui-npm-cache") },
  });
  if (result.status !== 0) throw new Error(result.stderr || "npm pack fallo");
  const jsonStart = result.stdout.lastIndexOf("\n[");
  const [report] = JSON.parse(result.stdout.slice(jsonStart >= 0 ? jsonStart + 1 : 0));
  const actual = { packed: report.size, unpacked: report.unpackedSize };
  for (const [metric, limit] of Object.entries(limits)) {
    if (actual[metric] > limit) {
      throw new Error(`${metric} ${actual[metric]} excede presupuesto ${limit}`);
    }
  }
  console.log(
    `Presupuesto de paquete correcto: ${actual.packed}/${limits.packed} bytes comprimidos, ` +
    `${actual.unpacked}/${limits.unpacked} bytes descomprimidos`,
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
