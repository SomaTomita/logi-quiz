import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockPasswordResetAPI } from '../fixtures/api-mocks'

test.describe.serial('Password Reset Page', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await page.goto('/reset-password')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays reset password form', async () => {
    await expect(page.getByText('パスワードリセット')).toBeVisible()
    await expect(page.getByLabel('メールアドレス')).toBeVisible()
    await expect(page.getByRole('button', { name: 'リセットメールを送信' })).toBeVisible()
  })

  test('submit button disabled when email is empty', async () => {
    await expect(page.getByRole('button', { name: 'リセットメールを送信' })).toBeDisabled()
  })

  test('shows success message after sending reset email', async () => {
    await mockPasswordResetAPI(page)

    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByRole('button', { name: 'リセットメールを送信' }).click()

    await expect(page.getByText('メールを送信しました')).toBeVisible()
    await expect(page.getByText('パスワードリセット用のリンクをメールで送信しました')).toBeVisible()
    await expect(page.getByRole('link', { name: 'ログインに戻る' })).toBeVisible()
  })
})
