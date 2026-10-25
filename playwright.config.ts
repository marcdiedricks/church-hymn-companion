import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/e2e-smoke.spec.ts',
  retries: 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3000', ...devices['Desktop Chrome'] },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
