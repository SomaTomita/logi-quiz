import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      slowMo: 1200,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    cwd: '..',
  },
})
