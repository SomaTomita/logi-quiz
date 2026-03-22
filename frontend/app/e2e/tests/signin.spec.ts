import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI, mockSignInAPI, mockSectionsAPI } from '../fixtures/api-mocks'

test.describe.serial('Sign In Page', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await page.goto('/signin')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays login form', async () => {
    await expect(page.getByText('おかえりなさい')).toBeVisible()
    await expect(page.getByLabel('メールアドレス')).toBeVisible()
    await expect(page.getByLabel('パスワード')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
  })

  test('shows validation error for empty email', async () => {
    await page.getByLabel('メールアドレス').focus()
    await page.getByLabel('メールアドレス').blur()
    await expect(page.getByText('メールアドレスを入力してください')).toBeVisible()
  })

  test('shows validation error for invalid email', async () => {
    await page.getByLabel('メールアドレス').fill('invalid-email')
    await page.getByLabel('メールアドレス').blur()
    await expect(page.getByText('正しいメールアドレスを入力してください')).toBeVisible()
  })

  test('shows validation error for short password', async () => {
    await page.getByLabel('パスワード').fill('12345')
    await page.getByLabel('パスワード').blur()
    await expect(page.getByText('パスワードは6文字以上で入力してください')).toBeVisible()
  })

  test('failed login shows error message', async () => {
    await mockSignInAPI(page, { fail: true })

    await page.getByLabel('メールアドレス').fill('wrong@example.com')
    await page.getByLabel('パスワード').fill('wrongpassword')
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page.getByText('メールアドレスまたはパスワードが正しくありません')).toBeVisible()
  })

  test('successful login redirects to sections', async () => {
    await page.unrouteAll({ behavior: 'ignoreErrors' })
    await mockSessionAPI(page, false)
    await mockSignInAPI(page)
    await mockSectionsAPI(page)

    await page.getByLabel('メールアドレス').fill('test@example.com')
    await page.getByLabel('パスワード').fill('password123')
    await page.getByRole('button', { name: 'ログイン' }).click()

    await expect(page).toHaveURL('/sections')
  })
})
