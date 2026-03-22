import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockSectionsAPI, mockQuizAPI, mockQuizSaveAPI } from '../fixtures/api-mocks'

test.describe.serial('Quiz Flow - Start to Exit', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await mockQuizAPI(page, '1')
    await mockSectionsAPI(page)
    await page.goto('/quiz/1')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('shows start screen with quiz info', async () => {
    await expect(page.getByText('クイズに挑戦')).toBeVisible()
    await expect(page.getByText('10問')).toBeVisible()
    await expect(page.getByText('各15秒')).toBeVisible()
    await expect(page.getByRole('button', { name: 'スタート' })).toBeVisible()
  })

  test('starts quiz and shows first question', async () => {
    await page.getByRole('button', { name: 'スタート' }).click()

    await expect(page.getByText('テスト問題1')).toBeVisible()
    await expect(page.getByText('1 / 10')).toBeVisible()
  })

  test('selecting answer enables next button', async () => {
    const nextButton = page.getByRole('button', { name: '次へ' })
    await expect(nextButton).toBeDisabled()

    await page.getByRole('radio').first().click()
    await expect(nextButton).toBeEnabled()
  })

  test('advancing updates progress', async () => {
    await page.getByRole('button', { name: '次へ' }).click()

    await expect(page.getByText('2 / 10')).toBeVisible()
    await expect(page.getByText('テスト問題2')).toBeVisible()
  })

  test('exit dialog cancel returns to quiz', async () => {
    await page.getByRole('button', { name: '退出' }).click()
    await expect(page.getByText('クイズを退出しますか？')).toBeVisible()

    await page.getByRole('button', { name: 'キャンセル' }).click()
    await expect(page.getByText('テスト問題2')).toBeVisible()
  })
})

test.describe.serial('Quiz Flow - Timer Expiration', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await mockQuizAPI(page, '1')
    await mockSectionsAPI(page)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('timer expiration auto-advances to next question', async () => {
    // Install fake timers before navigation
    await page.clock.install()
    await page.goto('/quiz/1')

    // Let React render the page
    await page.clock.runFor(500)
    await page.getByRole('button', { name: 'スタート' }).click()

    // Let React render question 1
    await page.clock.runFor(500)
    await expect(page.getByText('テスト問題1')).toBeVisible()

    // Fast-forward past the 15s timer (in small increments to let React process)
    await page.clock.runFor(15500)

    // Should auto-advance to question 2 without any user interaction
    await expect(page.getByText('テスト問題2')).toBeVisible()
    await expect(page.getByText('2 / 10')).toBeVisible()
  })
})

test.describe.serial('Quiz Flow - Complete All Questions', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, true)
    await mockQuizAPI(page, '1')
    await mockSectionsAPI(page)
    await mockQuizSaveAPI(page)

    await page.context().addCookies([
      { name: '_access_token', value: 'mock-token', domain: 'localhost', path: '/' },
      { name: '_client', value: 'mock-client', domain: 'localhost', path: '/' },
      { name: '_uid', value: 'test@example.com', domain: 'localhost', path: '/' },
    ])

    await page.goto('/quiz/1')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('last question shows complete button and completing shows result', async () => {
    await page.getByRole('button', { name: 'スタート' }).click()

    // Answer all 10 questions
    for (let i = 0; i < 10; i++) {
      await page.getByRole('radio').first().click()
      if (i === 9) {
        // Last question should show 完了 button
        await expect(page.getByText('10 / 10')).toBeVisible()
        await expect(page.getByRole('button', { name: '完了' })).toBeVisible()
        await page.getByRole('button', { name: '完了' }).click()
      } else {
        await page.getByRole('button', { name: '次へ' }).click()
      }
    }

    // Result screen
    await expect(page.getByText(/10問中/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'もう一度' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'セクション一覧へ' })).toBeVisible()
  })
})

test.describe.serial('Quiz Flow - Guest Limit', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await mockQuizAPI(page, '*')
    await mockSectionsAPI(page)

    // Set guest count to 2 (one more quiz triggers the limit)
    await page.goto('/sections')
    await page.evaluate(() => localStorage.setItem('logi_quiz_guest_count', '2'))
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('completing 3rd quiz shows login prompt modal', async () => {
    // Navigate to quiz and complete it
    await page.goto('/quiz/1')
    await page.getByRole('button', { name: 'スタート' }).click()

    for (let i = 0; i < 10; i++) {
      await page.getByRole('radio').first().click()
      const buttonName = i === 9 ? '完了' : '次へ'
      await page.getByRole('button', { name: buttonName }).click()
    }

    // Result screen should show, and modal should appear
    await expect(page.getByText(/10問中/)).toBeVisible()
    await expect(page.getByText('無料体験の上限に達しました')).toBeVisible()
  })

  test('modal signup button navigates to signup', async () => {
    await page.getByRole('button', { name: '無料で新規登録' }).click()
    await expect(page).toHaveURL('/signup')
  })

  test('guest cannot start quiz from sections after limit', async () => {
    // Go back to sections, reload to pick up localStorage
    await page.goto('/sections')
    await page.getByText('国際輸送の基礎').click()

    // Should show modal instead of navigating to quiz
    await expect(page.getByText('無料体験の上限に達しました')).toBeVisible()
  })

  test('modal dismiss returns to sections', async () => {
    await page.getByRole('button', { name: 'セクション一覧に戻る' }).click()
    await expect(page).toHaveURL('/sections')
    // Modal should be closed
    await expect(page.getByText('無料体験の上限に達しました')).not.toBeVisible()
  })
})
