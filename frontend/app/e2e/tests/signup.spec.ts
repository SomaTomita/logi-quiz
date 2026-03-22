import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockSignUpAPI, mockSectionsAPI } from '../fixtures/api-mocks'

test.describe.serial('Sign Up Page', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await page.goto('/signup')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays registration form', async () => {
    await expect(page.getByRole('heading', { name: 'アカウント作成' })).toBeVisible()
    await expect(page.getByLabel('名前')).toBeVisible()
    await expect(page.getByLabel('メールアドレス')).toBeVisible()
    await expect(page.getByLabel('パスワード', { exact: true })).toBeVisible()
    await expect(page.getByLabel('パスワード（確認）')).toBeVisible()
  })

  test('shows validation for required fields', async () => {
    await page.getByLabel('名前').focus()
    await page.getByLabel('名前').blur()
    await expect(page.getByText('名前を入力してください')).toBeVisible()
  })

  test('shows password mismatch error', async () => {
    await page.getByLabel('パスワード', { exact: true }).fill('password123')
    await page.getByLabel('パスワード（確認）').fill('different')
    await page.getByLabel('パスワード（確認）').blur()
    await expect(page.getByText('パスワードが一致しません')).toBeVisible()
  })

  test('has link to signin page', async () => {
    await page.getByRole('link', { name: 'ログイン' }).click()
    await expect(page).toHaveURL('/signin')
  })

  test('successful registration redirects to sections', async () => {
    await page.unrouteAll({ behavior: 'ignoreErrors' })
    await mockSessionAPI(page, false)
    await mockSignUpAPI(page)
    await mockSectionsAPI(page)

    await page.goto('/signup')

    await page.getByLabel('名前').fill('新しいユーザー')
    await page.getByLabel('メールアドレス').fill('new@example.com')
    await page.getByLabel('パスワード', { exact: true }).fill('password123')
    await page.getByLabel('パスワード（確認）').fill('password123')
    await page.getByRole('button', { name: 'アカウント作成' }).click()

    await expect(page).toHaveURL('/sections')
  })
})
