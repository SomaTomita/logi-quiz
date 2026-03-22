import { test, expect, type Page } from '@playwright/test'
import { mockSessionAPI } from '../fixtures/api-mocks'

test.describe.serial('Landing Page', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
    await page.goto('/')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays hero section and feature cards', async () => {
    await expect(page.getByRole('heading', { name: /クイズで身につく/ })).toBeVisible()
    await expect(page.getByRole('link', { name: '無料で始める' }).first()).toBeVisible()

    await expect(page.getByRole('heading', { name: '4択クイズ形式' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '15秒の制限時間' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '丁寧な解説' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '学習進捗の可視化' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'すぐに始められる' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'どこでも学習' })).toBeVisible()
  })

  test('CTA navigates to sections', async () => {
    await page.getByRole('link', { name: '無料で始める' }).first().click()
    await expect(page).toHaveURL('/sections')
  })

  test('login link navigates to signin page', async () => {
    await page.goto('/')
    await page.getByRole('link', { name: 'ログイン' }).first().click()
    await expect(page).toHaveURL('/signin')
  })
})
