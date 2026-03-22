import { test, expect, type Page } from '@playwright/test'
import {
  mockSessionAPI,
  mockReviewAPI,
  mockReviewCompleteAPI,
  mockSectionsAPI,
} from '../fixtures/api-mocks'

// Helper: set auth cookies + session mock on a page
async function setupAuth(page: Page) {
  await page.context().addCookies([
    { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
    { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
    { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
  ])
  await mockSessionAPI(page, true)
}

// --- Unauthenticated ---

test.describe.serial('Review Page - Unauthenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('redirects to signin when not authenticated', async () => {
    await page.goto('/review')
    await expect(page).toHaveURL('/signin')
  })
})

// --- Queue display ---

test.describe.serial('Review Page - Queue', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page)
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays queue with due question count and start button', async () => {
    await expect(page.getByText('3問')).toBeVisible()
    await expect(page.getByText('復習すべき問題があります')).toBeVisible()
    await expect(page.getByRole('button', { name: '復習を始める' })).toBeVisible()
  })
})

test.describe.serial('Review Page - Loading', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page, { delay: 3000 })
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('shows loading spinner while fetching queue', async () => {
    await expect(page.getByRole('progressbar')).toBeVisible()
  })
})

test.describe.serial('Review Page - Empty Queue', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page, { empty: true })
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays empty queue message', async () => {
    await expect(page.getByText('復習完了！')).toBeVisible()
    await expect(page.getByText('現在、復習すべき問題はありません')).toBeVisible()
    await expect(page.getByRole('button', { name: 'セクション一覧へ' })).toBeVisible()
  })
})

test.describe.serial('Review Page - Error', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page, { error: true })
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('shows error message on API failure', async () => {
    await expect(page.getByText('復習データの読み込みに失敗しました。')).toBeVisible()
  })
})

// --- Session with exit dialog ---

test.describe.serial('Review Page - Session Exit', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page)
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('exit dialog: cancel returns to session, confirm returns to queue', async () => {
    await page.getByRole('button', { name: '復習を始める' }).click()

    // Click exit
    await page.getByRole('button', { name: '退出' }).click()
    await expect(page.getByText('復習を退出しますか？')).toBeVisible()

    // Cancel
    await page.getByRole('button', { name: 'キャンセル' }).click()
    await expect(page.getByText('CIFの定義は？')).toBeVisible()

    // Exit again and confirm
    await page.getByRole('button', { name: '退出' }).click()
    await page.getByRole('button', { name: 'はい' }).click()

    // Should return to queue view
    await expect(page.getByText('復習すべき問題があります')).toBeVisible()
  })
})

// --- Full session to result ---

test.describe.serial('Review Page - Session to Result', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAuth(page)
    await mockReviewAPI(page)
    await mockReviewCompleteAPI(page)
    await page.goto('/review')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('complete all questions and see results', async () => {
    await page.getByRole('button', { name: '復習を始める' }).click()

    // Question 1
    await expect(page.getByText('CIFの定義は？')).toBeVisible()
    await expect(page.getByText('1 / 3')).toBeVisible()
    await page.getByRole('radio').first().click()
    await page.getByRole('button', { name: '次へ' }).click()

    // Question 2
    await expect(page.getByText('FOBの責任範囲は？')).toBeVisible()
    await expect(page.getByText('2 / 3')).toBeVisible()
    await page.getByRole('radio').first().click()
    await page.getByRole('button', { name: '次へ' }).click()

    // Question 3 (last)
    await expect(page.getByText('B/Lとは何か？')).toBeVisible()
    await expect(page.getByText('3 / 3')).toBeVisible()
    await page.getByRole('radio').first().click()
    await expect(page.getByRole('button', { name: '完了' })).toBeVisible()
    await page.getByRole('button', { name: '完了' }).click()

    // Result screen
    await expect(page.getByText(/3問中/)).toBeVisible()
    await expect(page.getByText('復習結果')).toBeVisible()
  })

  test('shows score and message', async () => {
    await expect(page.getByText(/3問中.*問正解/)).toBeVisible()
    const messages = ['素晴らしい！', 'いい調子！', 'もう一度挑戦しよう！']
    const messageVisible = await Promise.any(
      messages.map((m) => page.getByText(m).waitFor({ timeout: 3000 }).then(() => true)),
    ).catch(() => false)
    expect(messageVisible).toBe(true)
  })

  test('accordion shows explanations and SRS box level chips', async () => {
    await page.getByText('復習問題1: CIFの定義は？').first().click()
    await expect(page.getByText('CIFはCost, Insurance and Freightの略')).toBeVisible()
    await expect(page.getByText(/次回:/).first()).toBeVisible()
  })

  test('continue review button reloads queue', async () => {
    await expect(page.getByRole('button', { name: '続けて復習' })).toBeVisible()

    // Mock the next queue fetch (empty this time)
    await page.unrouteAll({ behavior: 'ignoreErrors' })
    await setupAuth(page)
    await mockReviewAPI(page, { empty: true })
    await page.getByRole('button', { name: '続けて復習' }).click()

    await expect(page.getByText('復習完了！')).toBeVisible()
  })
})
