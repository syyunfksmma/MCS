import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const browsersPath = process.env.PLAYWRIGHT_BROWSERS_PATH;

if (!browsersPath) {
  console.log('[playwright:install-offline] PLAYWRIGHT_BROWSERS_PATH not set. Falling back to default 
px playwright install.');
  const result = spawnSync('npx', ['playwright', 'install'], { stdio: 'inherit', shell: true });
  process.exit(result.status ?? 0);
}

if (!existsSync(browsersPath)) {
  console.error([playwright:install-offline] Path "" does not exist. Please make sure the offline bundle is unpacked.);
  process.exit(1);
}

console.log([playwright:install-offline] Using existing browsers at .);
console.log('[playwright:install-offline] No additional download required. Ensure PLAYWRIGHT_BROWSERS_PATH is exported before running tests.');

// Playwright automatically reads PLAYWRIGHT_BROWSERS_PATH, so no further action is needed here.
