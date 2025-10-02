#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const env = { ...process.env };

if (!env.NEXT_PUBLIC_API_BASE_URL) {
  env.NEXT_PUBLIC_API_BASE_URL = "http://127.0.0.1:3100";
}

if (!env.MCMS_API_BASE_URL) {
  env.MCMS_API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;
}

if (!env.PLAYWRIGHT_SMOKE) {
  env.PLAYWRIGHT_SMOKE = "true";
}

if (!env.K6_PROFILE) {
  env.K6_PROFILE = "smoke";
}

if (!env.K6_SUMMARY_PATH) {
  env.K6_SUMMARY_PATH = "artifacts/perf/k6-smoke-latest.json";
}

if (!env.K6_BASE_URL) {
  env.K6_BASE_URL = "http://127.0.0.1:3000";
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n▶ ${command} ${args.join(" ")}`);
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: { ...env, ...options.env },
      stdio: "inherit",
      shell: process.platform === "win32"
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

(async () => {
  try {
    await run("npx", ["playwright", "test", "--grep", "@smoke"], { cwd: projectRoot });
    await run("k6", ["run", "scripts/performance/k6-workspace.js"], { cwd: projectRoot });
    console.log("\n✅ Playwright @smoke + k6 smoke 흐름이 완료되었습니다.");
  } catch (error) {
    console.error("\n❌ Smoke 흐름이 실패했습니다.");
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
})();
