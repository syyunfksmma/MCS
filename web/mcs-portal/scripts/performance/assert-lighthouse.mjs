#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = path.resolve(process.cwd(), "reports", "lighthouse");
const MIN_SCORES = {
  performance: Number(process.env.LH_MIN_PERF ?? 85),
  accessibility: Number(process.env.LH_MIN_A11Y ?? 90),
  'best-practices': Number(process.env.LH_MIN_BP ?? 90),
  seo: Number(process.env.LH_MIN_SEO ?? 90)
};

function readJson(file) {
  const content = fs.readFileSync(file, "utf8");
  return JSON.parse(content);
}

function validateReport(reportPath) {
  const json = readJson(reportPath);
  const categories = json.categories ?? {};
  const failures = [];

  for (const [key, minScore] of Object.entries(MIN_SCORES)) {
    const category = categories[key];
    if (!category) {
      failures.push(`${key} category missing in ${path.basename(reportPath)}`);
      continue;
    }
    const score = Math.round((category.score ?? 0) * 100);
    if (score < minScore) {
      failures.push(`${key} score ${score} < ${minScore} (${path.basename(reportPath)})`);
    }
  }

  if (failures.length) {
    throw new Error(failures.join("\n"));
  }
}

function main() {
  if (!fs.existsSync(REPORT_DIR)) {
    console.error(`[lh-assert] directory not found: ${REPORT_DIR}`);
    process.exit(1);
  }

  const reports = fs.readdirSync(REPORT_DIR).filter(file => file.endsWith(".json"));
  if (reports.length === 0) {
    console.error("[lh-assert] no Lighthouse JSON reports found");
    process.exit(1);
  }

  const errors = [];
  for (const report of reports) {
    const fullPath = path.join(REPORT_DIR, report);
    try {
      validateReport(fullPath);
      console.log(`[lh-assert] OK ${report}`);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  if (errors.length) {
    console.error("[lh-assert] validation failed:\n" + errors.join("\n"));
    process.exit(1);
  }
}

main();
