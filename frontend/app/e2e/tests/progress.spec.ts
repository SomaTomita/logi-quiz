import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockDashboardAPI } from '../fixtures/api-mocks'

test.describe.serial('Progress Page - Unauthenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('redirects to signin when not authenticated', async () => {
    await page.goto('/progress')
    await expect(page).toHaveURL('/signin')
  })
})

test.describe.serial('Progress Page - Authenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.context().addCookies([
      { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
      { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
      { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
    ])
    await mockSessionAPI(page, true)
    await mockDashboardAPI(page)
    await page.goto('/progress')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays stats cards, heatmap, session history, and user name', async () => {
    // Stats cards
    await expect(page.getByText('学習進捗')).toBeVisible()
    await expect(page.getByText('20分')).toBeVisible()
    await expect(page.getByText('85')).toBeVisible()
    await expect(page.getByText('総プレイ時間')).toBeVisible()
    await expect(page.getByText('総正解数')).toBeVisible()
    await expect(page.getByText('学習ストリーク')).toBeVisible()

    // Heatmap
    await expect(page.getByText('学習カレンダー')).toBeVisible()

    // Session history
    await expect(page.getByText('最近のセッション')).toBeVisible()
    await expect(page.getByText('国際輸送の基礎')).toBeVisible()
    await expect(page.getByText('9/10')).toBeVisible()
    await expect(page.getByText('貿易実務')).toBeVisible()
    await expect(page.getByText('7/10')).toBeVisible()

    // User name
    await expect(page.getByText('テストユーザーさんの学習記録')).toBeVisible()
  })
})
