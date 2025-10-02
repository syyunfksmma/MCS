import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH;

const log = (message) => console.log(`[playwright:install-offline] ${message}`);

if (!browsersPath) {
  log('PLAYWRIGHT_BROWSERS_PATH not set. Falling back to direct playwright install.');
  const result = spawnSync('npx', ['playwright', 'install', '--with-deps'], {
    stdio: 'inherit',
    shell: true
  });
  process.exit(result.status ?? 0);
}

if (!existsSync(browsersPath)) {
  console.error(`[playwright:install-offline] Path "${browsersPath}" does not exist. Please unpack the offline bundle first.`);
  process.exit(1);
}

const chromiumExecutable = path.join(browsersPath, 'chromium-1187', 'chrome-win', 'chrome.exe');
if (!existsSync(chromiumExecutable)) {
  console.error(`[playwright:install-offline] Chromium executable missing at "${chromiumExecutable}". Ensure the offline bundle is complete.`);
  process.exit(1);
}

log(`Using existing browsers at ${browsersPath}.`);
log('No additional download required. Ensure PLAYWRIGHT_BROWSERS_PATH is exported before running tests.');
