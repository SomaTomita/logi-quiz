import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockSectionsAPI, mockSectionsErrorAPI, mockQuizAPI } from '../fixtures/api-mocks'

test.describe.serial('Sections Page - Guest', () => {
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

  test('displays section cards, guest banner, and section count', async () => {
    await expect(page.getByText('セクション一覧')).toBeVisible()
    await expect(page.getByText('国際輸送の基礎')).toBeVisible()
    await expect(page.getByText('貿易実務')).toBeVisible()
    await expect(page.getByText('インコタームズ')).toBeVisible()

    await expect(page.getByText(/ログインなしで.*回までクイズをお試しできます/)).toBeVisible()
    await expect(page.getByText('3 セクション')).toBeVisible()
  })
})

test.describe.serial('Sections Page - Error', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await mockSectionsErrorAPI(page)
    await page.goto('/sections')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('shows error state when API fails', async () => {
    await expect(page.getByText('セクションを読み込めませんでした')).toBeVisible()
    await expect(page.getByRole('button', { name: '再読み込み' })).toBeVisible()
  })
})

test.describe.serial('Sections Page - Authenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, true)
    await mockSectionsAPI(page)
    await mockQuizAPI(page)

    await page.context().addCookies([
      { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
      { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
      { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
    ])

    await page.goto('/sections')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('authenticated user does not see guest banner', async () => {
    await expect(page.getByText('セクション一覧')).toBeVisible()
    await expect(page.getByText(/ログインなしで.*回までクイズをお試しできます/)).not.toBeVisible()
  })

  test('clicking section navigates to quiz page', async () => {
    await page.getByText('国際輸送の基礎').click()
    await expect(page).toHaveURL('/quiz/1')
  })
})
