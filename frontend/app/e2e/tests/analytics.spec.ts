import { test, expect, type Page } from '@playwright/test'
import { mockAdminSessionAPI, mockAnalyticsAPI, mockAnalyticsErrorAPI, mockSessionAPI } from '../fixtures/api-mocks'

// ─── Helper: set admin cookies + mock admin session ───
async function setupAdmin(page: Page) {
  await page.context().addCookies([
    { name: '_access_token', value: 'mock-admin-token', domain: 'localhost', path: '/' },
    { name: '_client', value: 'mock-admin-client', domain: 'localhost', path: '/' },
    { name: '_uid', value: 'admin@example.com', domain: 'localhost', path: '/' },
  ])
  await mockAdminSessionAPI(page)
}

// ═══════════════════════════════════════════════════════
// Analytics Dashboard - Unauthenticated Access
// ═══════════════════════════════════════════════════════
test.describe.serial('Analytics Page - Unauthenticated', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await mockSessionAPI(page, false)
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('redirects to signin when not authenticated', async () => {
    await page.goto('/admin/analytics')
    await expect(page).not.toHaveURL('/admin/analytics')
  })
})

// ═══════════════════════════════════════════════════════
// Analytics Dashboard - Full Render (admin + mock data)
// ═══════════════════════════════════════════════════════
test.describe.serial('Analytics Page - Dashboard Render', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAdmin(page)
    await mockAnalyticsAPI(page)
    await page.goto('/admin/analytics')
    await page.waitForLoadState('networkidle')
  })

  test.afterAll(async () => {
    await page.close()
  })

  // --- Page Header ---
  test('displays page title and subtitle', async () => {
    await expect(page.getByText('学習分析ダッシュボード')).toBeVisible()
    await expect(page.getByText('ユーザー行動データの可視化と分析')).toBeVisible()
  })

  // --- KPI StatCards ---
  test('displays overview KPI stat cards', async () => {
    await expect(page.getByText('30日間アクティブユーザー', { exact: true })).toBeVisible()
    await expect(page.getByText('総合正答率', { exact: true })).toBeVisible()
    await expect(page.getByText('63.6%', { exact: true })).toBeVisible()
    await expect(page.getByText('平均回答時間', { exact: true })).toBeVisible()
    await expect(page.getByText('7.7s', { exact: true })).toBeVisible()
    await expect(page.getByText('習得率 (Box 4)', { exact: true })).toBeVisible()
  })

  // --- Topic Performance Charts ---
  test('displays topic performance bar chart and radar chart', async () => {
    await expect(page.getByText('セクション別正答率')).toBeVisible()
    await expect(page.getByText('各トピックの正答率と平均回答時間')).toBeVisible()
    await expect(page.getByText('トピックバランス')).toBeVisible()

    // Section names should appear in the charts
    await expect(page.getByText('インコタームズ').first()).toBeVisible()
    await expect(page.getByText('貿易書類').first()).toBeVisible()
    await expect(page.getByText('海上輸送').first()).toBeVisible()
  })

  // --- Study Patterns ---
  test('displays study patterns charts', async () => {
    await expect(page.getByText('学習パターン推移')).toBeVisible()
    await expect(page.getByText('アクティブユーザー数と平均学習時間のトレンド')).toBeVisible()
    await expect(page.getByText('学習時間分布')).toBeVisible()
  })

  // --- Response Time Analysis ---
  test('displays response time analysis charts', async () => {
    await expect(page.getByText('回答時間分布')).toBeVisible()
    await expect(page.getByText('セクション別回答時間')).toBeVisible()
    await expect(page.getByText('回答速度と正答率の相関')).toBeVisible()
    await expect(page.getByText('速く回答するほど正答率が高い傾向があるか？')).toBeVisible()
  })

  // --- SRS Retention Analysis (centerpiece) ---
  test('displays SRS fixed-interval critique alert', async () => {
    const alert = page.getByRole('alert')
    await expect(alert).toBeVisible()
    await expect(alert.getByText('SRS固定間隔分析結果')).toBeVisible()
    await expect(alert.getByText(/High retention variance/)).toBeVisible()
  })

  test('displays retention variance chart', async () => {
    await expect(page.getByText('ボックスレベル別 記憶定着率のばらつき')).toBeVisible()
    await expect(page.getByText(/同じ固定間隔でもユーザーごとに/)).toBeVisible()
  })

  test('displays box level distribution and retention charts', async () => {
    await expect(page.getByText('ボックスレベル分布')).toBeVisible()
    await expect(page.getByText('ボックスレベル別定着率')).toBeVisible()
  })

  test('displays time to mastery histogram', async () => {
    await expect(page.getByText('習得までの日数分布')).toBeVisible()
    await expect(page.getByText(/平均47.3日/)).toBeVisible()
    await expect(page.getByText(/中央値: 42日/)).toBeVisible()
  })

  test('displays SRS annotation explaining fixed-interval limitation', async () => {
    await expect(page.getByText(/固定間隔の復習スケジュール/)).toBeVisible()
    await expect(page.getByText(/学習者ごとの記憶定着パターンの違いに適応できません/)).toBeVisible()
  })

  // --- Learner Segments ---
  test('displays learner segment chips', async () => {
    await expect(page.getByText(/Fast & Accurate/).first()).toBeVisible()
    await expect(page.getByText(/Struggling/).first()).toBeVisible()
  })

  test('displays learner segment scatter chart', async () => {
    await expect(page.getByText('学習者セグメント分析')).toBeVisible()
    await expect(page.getByText('回答速度 x 正答率による4象限分類')).toBeVisible()
  })

  test('displays per-segment SRS outcomes', async () => {
    await expect(page.getByText('セグメント別SRS結果')).toBeVisible()
    await expect(page.getByText(/同じ固定間隔でもセグメントにより異なる定着率/)).toBeVisible()
  })

  // --- Recharts SVG elements ---
  test('renders multiple recharts visualizations', async () => {
    const charts = page.locator('svg.recharts-surface')
    const count = await charts.count()
    expect(count).toBeGreaterThanOrEqual(10) // At least 10 charts
  })
})

// ═══════════════════════════════════════════════════════
// Analytics Dashboard - Admin Sidebar Navigation
// ═══════════════════════════════════════════════════════
test.describe.serial('Analytics Page - Sidebar Navigation', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAdmin(page)
    await mockAnalyticsAPI(page)
    await page.goto('/admin/analytics')
    await page.waitForLoadState('networkidle')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('admin sidebar shows analytics nav item as active', async () => {
    const sidebar = page.locator('nav')
    await expect(sidebar.getByText('学習分析')).toBeVisible()
    await expect(sidebar.getByText('セクション管理')).toBeVisible()
    await expect(sidebar.getByText('クイズ管理')).toBeVisible()
    await expect(sidebar.getByText('アプリに戻る')).toBeVisible()
  })

  test('analytics nav item has active/selected styling', async () => {
    // The active item should have the primary background color
    const analyticsLink = page.locator('nav a').filter({ hasText: '学習分析' })
    await expect(analyticsLink).toHaveCSS('background-color', 'rgb(79, 70, 229)') // primary #4F46E5
  })
})

// ═══════════════════════════════════════════════════════
// Analytics Dashboard - Error State
// ═══════════════════════════════════════════════════════
test.describe.serial('Analytics Page - Error State', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage()
    await setupAdmin(page)
    await mockAnalyticsErrorAPI(page)
    await page.goto('/admin/analytics')
    await page.waitForLoadState('networkidle')
  })

  test.afterAll(async () => {
    await page.close()
  })

  test('displays error message when API fails', async () => {
    await expect(page.getByText('分析データを読み込めませんでした')).toBeVisible()
    await expect(page.getByText(/Request failed/)).toBeVisible()
  })

  test('displays reload button on error', async () => {
    await expect(page.getByRole('button', { name: '再読み込み' })).toBeVisible()
  })
})
