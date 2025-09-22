import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import fs from 'node:fs';
import path from 'node:path';

const TARGET_PAGES = [
  { url: 'http://localhost:3000/', name: 'landing' },
  { url: 'http://localhost:3000/admin', name: 'admin' }
];

const REPORT_ROOT = path.resolve(process.cwd(), 'reports');
const LIGHTHOUSE_DIR = path.join(REPORT_ROOT, 'lighthouse');

function exec(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', code => {
      if (code === 0) {
        resolve(undefined);
      } else {
        reject(new Error(${command} exited with code ));
      }
    });
  });
}

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        return;
      }
    } catch (error) {
      // swallow and retry
    }
    await delay(1000);
  }
  throw new Error(Server did not respond at );
}

async function runLighthouseForTarget(target) {
  const filename = lighthouse-.json;
  const outputPath = path.join(LIGHTHOUSE_DIR, filename);
  const args = [
    target.url,
    '--preset=desktop',
    '--chrome-flags=--headless --no-sandbox',
    '--output=json',
    --output-path=
  ];
  console.log(\n[perf] Running Lighthouse for );
  await exec('npx', ['lighthouse', ...args]);
  console.log([perf] Report written to );
}

async function run() {
  fs.mkdirSync(LIGHTHOUSE_DIR, { recursive: true });

  console.log('[perf] Starting Next.js server on port 3000');
  const server = spawn('npm', ['run', 'start', '--', '-p', '3000'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  try {
    await waitForServer('http://localhost:3000/');
    for (const target of TARGET_PAGES) {
      await runLighthouseForTarget(target);
    }
  } finally {
    console.log('[perf] Shutting down Next.js server');
    server.kill('SIGINT');
  }
}

run().catch(error => {
  console.error('[perf] Lighthouse run failed:', error);
  process.exitCode = 1;
});
