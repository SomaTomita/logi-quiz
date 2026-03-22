import { test as base, type Page } from '@playwright/test'
import { mockSessionAPI } from './api-mocks'

// Fixture that provides an authenticated page (cookies + session mock)
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    // Set auth cookies before any navigation
    await page.context().addCookies([
      { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
      { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
      { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
    ])

    // Mock the session validation endpoint
    await mockSessionAPI(page, true)

    await use(page)
  },
})

export { expect } from '@playwright/test'
