import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI } from '../fixtures/api-mocks'

// These tests assume the default locale is 'ja' (configured in src/i18n/index.ts).

test.describe.serial('Language Switcher', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await page.goto('/')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('landing page shows Japanese by default', async () => {
    await expect(
      page.getByRole('heading', { name: /クイズで身につく/ })
    ).toBeVisible()
  })

  test('clicking language switcher shows language menu', async () => {
    await page.getByRole('button', { name: /change language/i }).click()
    await expect(page.getByRole('menuitem', { name: 'English' })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: '日本語' })).toBeVisible()
  })

  test('switching to English changes page content', async () => {
    await page.getByRole('menuitem', { name: 'English' }).click()
    await expect(
      page.getByRole('heading', { name: /Master/ })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Start for Free/i }).first()
    ).toBeVisible()
  })

  test('switcher badge shows EN after switch', async () => {
    await expect(page.getByText('EN')).toBeVisible()
  })

  test('switching back to Japanese restores Japanese content', async () => {
    await page.getByRole('button', { name: /change language/i }).click()
    await page.getByRole('menuitem', { name: '日本語' }).click()
    await expect(
      page.getByRole('heading', { name: /クイズで身につく/ })
    ).toBeVisible()
    await expect(page.getByText('JA')).toBeVisible()
  })
})
