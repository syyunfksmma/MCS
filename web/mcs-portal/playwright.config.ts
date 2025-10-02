import { defineConfig } from '@playwright/test';

const resolveChannel = () => {
  const channel = process.env.PLAYWRIGHT_CHANNEL?.trim();
  return channel && channel.length > 0 ? channel : 'chromium';
};

const isWindows = process.platform === 'win32';
const webServerCommand = isWindows
  ? 'cmd /c "npm run build && npm run start"'
  : 'npm run build && npm run start';

export default defineConfig({
  testDir: './tests/e2e',
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    channel: resolveChannel(),
    ignoreHTTPSErrors: true
  },
  webServer: {
    command: webServerCommand,
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000
  }
});

