import { defineConfig } from '@playwright/test';

const resolveChannel = () => {
  const channel = process.env.PLAYWRIGHT_CHANNEL?.trim();
  return channel && channel.length > 0 ? channel : 'msedge';
};

export default defineConfig({
  testDir: './tests/e2e',
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    channel: resolveChannel()
  }
});

