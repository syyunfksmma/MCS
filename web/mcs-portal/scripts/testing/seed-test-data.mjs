#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const now = new Date().toISOString();
const seedPayload = {
  generatedAt: now,
  seeds: [
    {
      type: "product",
      id: "PRD-CAM-001",
      revisions: ["A", "B"],
      routings: ["RT-CAM-001-A", "RT-CAM-001-B"]
    },
    {
      type: "workspace",
      id: "WS-DEV-001",
      files: ["sample.3dm", "process.pdf"],
      owner: "codex"
    }
  ]
};

const outputDir = join(process.cwd(), "test-results", "mocks");
const outputFile = join(outputDir, `seed-report-${Date.now()}.json`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, JSON.stringify(seedPayload, null, 2), "utf-8");

console.log(`[seed-test-data] wrote ${outputFile}`);
