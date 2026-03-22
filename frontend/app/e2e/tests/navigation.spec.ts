import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockSectionsAPI, mockDashboardAPI, mockReviewAPI, mockSignOutAPI } from '../fixtures/api-mocks'

test.describe.serial('Sidebar Navigation - Guest', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await mockSectionsAPI(page)
    await page.goto('/sections')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('guest sees only sections tab and login button', async () => {
    const sidebar = page.locator('nav')

    // セクション tab visible
    await expect(sidebar.getByText('セクション')).toBeVisible()

    // 復習 and 進捗 tabs hidden for guest
    await expect(sidebar.getByText('復習')).not.toBeVisible()
    await expect(sidebar.getByText('進捗')).not.toBeVisible()

    // Login button visible instead of user info
    await expect(sidebar.getByText('ログイン')).toBeVisible()
  })

  test('login button navigates to signin', async () => {
    await page.locator('nav').getByText('ログイン').click()
    await expect(page).toHaveURL('/signin')
  })
})

test.describe.serial('Sidebar Navigation - Authenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await page.context().addCookies([
      { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
      { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
      { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
    ])
    await mockSessionAPI(page, true)
    await mockSectionsAPI(page)
    await mockDashboardAPI(page)
    await mockReviewAPI(page)
    await mockSignOutAPI(page)
    await page.goto('/sections')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('authenticated user sees all tabs and user info', async () => {
    const sidebar = page.locator('nav')

    await expect(sidebar.getByText('セクション')).toBeVisible()
    await expect(sidebar.getByText('復習')).toBeVisible()
    await expect(sidebar.getByText('進捗')).toBeVisible()

    // User name displayed
    await expect(sidebar.getByText('テストユーザー')).toBeVisible()
  })

  test('clicking review tab navigates to review page', async () => {
    await page.locator('nav').getByText('復習').click()
    await expect(page).toHaveURL('/review')
  })

  test('clicking progress tab navigates to progress page', async () => {
    await page.locator('nav').getByText('進捗').click()
    await expect(page).toHaveURL('/progress')
  })

  test('clicking sections tab navigates back to sections', async () => {
    await page.locator('nav').getByText('セクション').click()
    await expect(page).toHaveURL('/sections')
  })

  test('logout button signs out and redirects to landing', async () => {
    await page.getByRole('button', { name: 'サインアウト' }).click()
    await expect(page).toHaveURL('/')
  })
})
