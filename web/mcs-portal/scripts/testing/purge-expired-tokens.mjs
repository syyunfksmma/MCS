#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const logDir = join(process.cwd(), "logs", "auth");
if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}
const logFile = join(logDir, `purge-${Date.now()}.log`);

const now = new Date().toISOString();
writeFileSync(logFile, `[${now}] purge placeholder - implement DB cleanup`, "utf-8");
console.log(`[auth:purge-expired] wrote ${logFile}`);
