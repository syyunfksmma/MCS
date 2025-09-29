#!/usr/bin/env node
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const outputDir = join(process.cwd(), "test-results", "mocks");
if (!existsSync(outputDir)) {
  console.log(`[reset-test-data] directory ${outputDir} does not exist. skipping.`);
  process.exit(0);
}

const entries = readdirSync(outputDir);
for (const entry of entries) {
  const fullPath = join(outputDir, entry);
  rmSync(fullPath, { force: true, recursive: true });
  console.log(`[reset-test-data] removed ${fullPath}`);
}

console.log(`[reset-test-data] completed at ${new Date().toISOString()}`);
