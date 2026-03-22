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
