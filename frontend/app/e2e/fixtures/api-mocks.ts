import type { Page } from '@playwright/test'

// API base URL — must match VITE_API_BASE_URL used by the app
const API_BASE = 'http://localhost:3001'

// ─── Mock Data (snake_case — axios-case-converter transforms to camelCase) ───

export const mockAdminUser = {
  id: 99,
  uid: 'admin@example.com',
  provider: 'email',
  email: 'admin@example.com',
  name: '管理者',
  nickname: null,
  image: null,
  admin: true,
  allow_password_change: false,
  total_play_time: 0,
  total_questions_cleared: 0,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2026-04-15T00:00:00.000Z',
}

export const mockUser = {
  id: 1,
  uid: 'test@example.com',
  provider: 'email',
  email: 'test@example.com',
  name: 'テストユーザー',
  nickname: null,
  image: null,
  admin: false,
  allow_password_change: false,
  total_play_time: 1200,
  total_questions_cleared: 85,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-03-22T00:00:00.000Z',
}

export const mockSections = [
  { id: 1, section_name: '国際輸送の基礎' },
  { id: 2, section_name: '貿易実務' },
  { id: 3, section_name: 'インコタームズ' },
]

export const mockQuizzes = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  question_text: `テスト問題${i + 1}`,
  choices: [
    { id: i * 4 + 1, choice_text: `選択肢A-${i + 1}`, is_correct: true },
    { id: i * 4 + 2, choice_text: `選択肢B-${i + 1}`, is_correct: false },
    { id: i * 4 + 3, choice_text: `選択肢C-${i + 1}`, is_correct: false },
    { id: i * 4 + 4, choice_text: `選択肢D-${i + 1}`, is_correct: false },
  ],
  explanation: { explanation_text: `問題${i + 1}の解説テキスト` },
}))

export const mockReviewQuestions = [
  {
    id: 101,
    question_text: '復習問題1: CIFの定義は？',
    choices: [
      { id: 401, choice_text: '運賃・保険料込み条件', is_correct: true },
      { id: 402, choice_text: '運賃込み条件', is_correct: false },
      { id: 403, choice_text: '本船渡し条件', is_correct: false },
      { id: 404, choice_text: '工場渡し条件', is_correct: false },
    ],
    explanation: { explanation_text: 'CIFはCost, Insurance and Freightの略で、運賃・保険料込み条件です。' },
    box_level: 0,
    attempt_count: 3,
    correct_count: 1,
  },
  {
    id: 102,
    question_text: '復習問題2: FOBの責任範囲は？',
    choices: [
      { id: 405, choice_text: '本船の船上に貨物を置いた時点', is_correct: true },
      { id: 406, choice_text: '工場出荷時点', is_correct: false },
      { id: 407, choice_text: '目的港到着時点', is_correct: false },
      { id: 408, choice_text: '通関完了時点', is_correct: false },
    ],
    explanation: { explanation_text: 'FOBはFree On Boardの略で、売主は本船に貨物を積むまでの責任を負います。' },
    box_level: 1,
    attempt_count: 5,
    correct_count: 3,
  },
  {
    id: 103,
    question_text: '復習問題3: B/Lとは何か？',
    choices: [
      { id: 409, choice_text: '船荷証券', is_correct: true },
      { id: 410, choice_text: '航空運送状', is_correct: false },
      { id: 411, choice_text: '保険証券', is_correct: false },
      { id: 412, choice_text: '信用状', is_correct: false },
    ],
    explanation: { explanation_text: 'B/LはBill of Ladingの略で、船荷証券と訳されます。' },
    box_level: 2,
    attempt_count: 2,
    correct_count: 2,
  },
]

export const mockReviewCompleteResults = [
  { question_id: 101, box_level: 1, next_review_at: '2026-03-25T00:00:00.000Z' },
  { question_id: 102, box_level: 2, next_review_at: '2026-03-29T00:00:00.000Z' },
  { question_id: 103, box_level: 3, next_review_at: '2026-04-05T00:00:00.000Z' },
]

const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

export const mockDashboardData = {
  data: {
    total_play_time: 1200,
    total_questions_cleared: 85,
    cleared_sections: [
      { section_name: '国際輸送の基礎', correct_answers: 9, cleared_at: '2026-03-22T10:00:00.000Z' },
      { section_name: '貿易実務', correct_answers: 7, cleared_at: '2026-03-21T14:00:00.000Z' },
      { section_name: 'インコタームズ', correct_answers: 4, cleared_at: '2026-03-20T09:00:00.000Z' },
    ],
    study_logs_past_year: [
      { date: today, study_time: 3 },
      { date: yesterday, study_time: 2 },
    ],
  },
}

// ─── Route Interception Helpers ───

export async function mockSessionAPI(page: Page, loggedIn: boolean) {
  if (loggedIn) {
    await page.route(`${API_BASE}/auth/sessions`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ is_login: true, data: mockUser }),
      }),
    )
  } else {
    await page.route(`${API_BASE}/auth/sessions`, (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: '{"errors":["unauthorized"]}' }),
    )
  }
}

export async function mockSectionsAPI(page: Page) {
  await page.route(`${API_BASE}/sections`, (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSections),
      })
    }
    return route.continue()
  })
}

export async function mockSectionsErrorAPI(page: Page) {
  await page.route(`${API_BASE}/sections`, (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Internal Server Error"}' }),
  )
}

export async function mockQuizAPI(page: Page, sectionId = '*') {
  await page.route(`${API_BASE}/sections/${sectionId}/quizzes`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockQuizzes),
    }),
  )
}

export async function mockQuizSaveAPI(page: Page) {
  await page.route(`${API_BASE}/dashboard/section_cleared`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":"ok"}' }),
  )
}

export async function mockDashboardAPI(page: Page) {
  await page.route(`${API_BASE}/dashboard/dashboard_data`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockDashboardData),
    }),
  )
}

export async function mockReviewAPI(page: Page, options?: { empty?: boolean; delay?: number; error?: boolean }) {
  await page.route(`${API_BASE}/reviews`, (route) => {
    if (route.request().method() === 'GET') {
      if (options?.error) {
        return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Server Error"}' })
      }
      const body = options?.empty
        ? JSON.stringify({ review_questions: [], total_due: 0 })
        : JSON.stringify({ review_questions: mockReviewQuestions, total_due: mockReviewQuestions.length })
      if (options?.delay) {
        return new Promise((resolve) =>
          setTimeout(() => resolve(route.fulfill({ status: 200, contentType: 'application/json', body })), options.delay),
        )
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body })
    }
    return route.continue()
  })
}

export async function mockReviewCompleteAPI(page: Page) {
  await page.route(`${API_BASE}/reviews/complete`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ results: mockReviewCompleteResults }),
    }),
  )
}

export async function mockSignInAPI(page: Page, options?: { fail?: boolean }) {
  await page.route(`${API_BASE}/auth/sign_in`, (route) => {
    if (options?.fail) {
      return route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ errors: ['メールアドレスまたはパスワードが正しくありません'] }),
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-token': 'mock-token', client: 'mock-client', uid: 'test@example.com' },
      body: JSON.stringify({ data: mockUser }),
    })
  })
}

export async function mockSignUpAPI(page: Page, options?: { fail?: boolean }) {
  await page.route(`${API_BASE}/auth`, (route) => {
    if (route.request().method() !== 'POST') return route.continue()
    if (options?.fail) {
      return route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ errors: { full_messages: ['メールアドレスはすでに使用されています'] } }),
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-token': 'mock-token', client: 'mock-client', uid: 'new@example.com' },
      body: JSON.stringify({ data: { ...mockUser, email: 'new@example.com', uid: 'new@example.com' } }),
    })
  })
}

export async function mockPasswordResetAPI(page: Page) {
  await page.route(`${API_BASE}/auth/password`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  )
}

export async function mockSignOutAPI(page: Page) {
  await page.route(`${API_BASE}/auth/sign_out`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' }),
  )
}

// ─── Admin Session Mock ───

export async function mockAdminSessionAPI(page: Page) {
  await page.route(`${API_BASE}/auth/sessions`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ is_login: true, data: mockAdminUser }),
    }),
  )
}

// ─── Analytics Mock Data (snake_case) ───

export const mockAnalyticsOverview = {
  data: {
    total_users: 21,
    active_users_7d: 15,
    active_users_30d: 20,
    total_attempts: 2404,
    overall_accuracy: 63.6,
    avg_response_time_ms: 7685,
    questions_in_srs: 442,
    mastery_rate: 20.4,
  },
}

export const mockTopicAccuracy = {
  data: {
    current: [
      { section_id: 1, section_name: 'インコタームズ', total_attempts: 320, correct_count: 256, accuracy_rate: 80.0, avg_response_time_ms: 5200 },
      { section_id: 2, section_name: '貿易書類', total_attempts: 280, correct_count: 182, accuracy_rate: 65.0, avg_response_time_ms: 7800 },
      { section_id: 3, section_name: '海上輸送', total_attempts: 250, correct_count: 125, accuracy_rate: 50.0, avg_response_time_ms: 9100 },
    ],
    trend: [
      { period_start: '2026-04-01', section_id: 1, section_name: 'インコタームズ', total_attempts: 80, accuracy_rate: 78.0 },
      { period_start: '2026-04-08', section_id: 1, section_name: 'インコタームズ', total_attempts: 90, accuracy_rate: 82.0 },
    ],
  },
}

export const mockEngagement = {
  data: {
    active_users: [
      { period_start: '2026-03-01', active_users: 12, total_study_time: 180, avg_study_time: 15.0 },
      { period_start: '2026-04-01', active_users: 18, total_study_time: 320, avg_study_time: 17.8 },
    ],
    study_time_distribution: [
      { range: '1-5', count: 45 },
      { range: '6-10', count: 82 },
      { range: '11-20', count: 56 },
      { range: '21-30', count: 20 },
      { range: '31+', count: 8 },
    ],
    session_duration_trend: [
      { period_start: '2026-03-01', avg_study_time: 12.3, max_study_time: 35, min_study_time: 1 },
      { period_start: '2026-04-01', avg_study_time: 15.1, max_study_time: 42, min_study_time: 2 },
    ],
  },
}

export const mockResponseTimes = {
  data: {
    histogram: [
      { bin_start: 0, bin_end: 1000, count: 12 },
      { bin_start: 1000, bin_end: 2000, count: 85 },
      { bin_start: 2000, bin_end: 3000, count: 145 },
      { bin_start: 3000, bin_end: 4000, count: 210 },
      { bin_start: 4000, bin_end: 5000, count: 180 },
      { bin_start: 5000, bin_end: 6000, count: 120 },
      { bin_start: 6000, bin_end: 7000, count: 75 },
    ],
    by_section: [
      { section_id: 1, section_name: 'インコタームズ', avg_ms: 5200, min_ms: 1200, max_ms: 18000, attempt_count: 320 },
      { section_id: 2, section_name: '貿易書類', avg_ms: 7800, min_ms: 2100, max_ms: 22000, attempt_count: 280 },
    ],
    correctness_correlation: [
      { speed_bucket: '0-3000ms', total_attempts: 242, accuracy_rate: 78.5 },
      { speed_bucket: '3001-5500ms', total_attempts: 600, accuracy_rate: 68.2 },
      { speed_bucket: '5501-9000ms', total_attempts: 520, accuracy_rate: 55.1 },
      { speed_bucket: '9001ms+', total_attempts: 340, accuracy_rate: 42.3 },
    ],
  },
}

export const mockRetentionCurves = {
  data: {
    box_distribution: [
      { box_level: 0, count: 152, percentage: 34.4 },
      { box_level: 1, count: 88, percentage: 19.9 },
      { box_level: 2, count: 52, percentage: 11.8 },
      { box_level: 3, count: 60, percentage: 13.6 },
      { box_level: 4, count: 90, percentage: 20.4 },
    ],
    retention_by_box: [
      { box_level: 0, total_states: 152, avg_attempts: 2.3, retention_rate: 34.2, expected_interval_days: 1 },
      { box_level: 1, total_states: 88, avg_attempts: 3.5, retention_rate: 55.8, expected_interval_days: 3 },
      { box_level: 2, total_states: 52, avg_attempts: 4.8, retention_rate: 68.4, expected_interval_days: 7 },
      { box_level: 3, total_states: 60, avg_attempts: 6.1, retention_rate: 79.2, expected_interval_days: 14 },
      { box_level: 4, total_states: 90, avg_attempts: 8.1, retention_rate: 91.3, expected_interval_days: 30 },
    ],
    time_to_mastery: {
      avg_days: 47.3,
      median_days: 42,
      min_days: 12,
      max_days: 95,
      std_dev: 18.7,
      distribution: [
        { range: '0-6', count: 2 },
        { range: '7-13', count: 8 },
        { range: '14-20', count: 15 },
        { range: '21-27', count: 22 },
        { range: '28-34', count: 18 },
      ],
    },
    retention_decay: [
      { box_level: 0, fixed_interval_days: 1, user_count: 18, mean_retention: 35.2, std_dev: 22.1, min_retention: 10.0, max_retention: 75.0 },
      { box_level: 1, fixed_interval_days: 3, user_count: 16, mean_retention: 56.8, std_dev: 19.3, min_retention: 25.0, max_retention: 88.0 },
      { box_level: 2, fixed_interval_days: 7, user_count: 14, mean_retention: 68.4, std_dev: 18.7, min_retention: 35.0, max_retention: 95.0 },
      { box_level: 3, fixed_interval_days: 14, user_count: 12, mean_retention: 78.5, std_dev: 16.2, min_retention: 45.0, max_retention: 100.0 },
      { box_level: 4, fixed_interval_days: 30, user_count: 10, mean_retention: 89.7, std_dev: 8.5, min_retention: 72.0, max_retention: 100.0 },
    ],
    fixed_interval_critique: {
      fixed_intervals: [1, 3, 7, 14, 30],
      variance_by_level: [
        { box_level: 0, std_dev: 22.1 },
        { box_level: 1, std_dev: 19.3 },
        { box_level: 2, std_dev: 18.7 },
        { box_level: 3, std_dev: 16.2 },
        { box_level: 4, std_dev: 8.5 },
      ],
      high_variance_count: 4,
      conclusion: 'High retention variance (std_dev > 15%) observed at 4/5 box levels. Fixed intervals of [1, 3, 7, 14, 30] days cannot adapt to this diversity. An adaptive algorithm should adjust intervals based on individual retention patterns.',
    },
  },
}

export const mockLearnerSegments = {
  data: {
    segments: [
      { total_attempts: 120, accuracy: 85.0, avg_response_ms: 3200, segment: 'fast_accurate', segment_label: 'Fast & Accurate' },
      { total_attempts: 95, accuracy: 78.0, avg_response_ms: 8500, segment: 'slow_accurate', segment_label: 'Slow & Accurate' },
      { total_attempts: 80, accuracy: 42.0, avg_response_ms: 2800, segment: 'fast_inaccurate', segment_label: 'Fast & Inaccurate' },
      { total_attempts: 60, accuracy: 35.0, avg_response_ms: 12000, segment: 'struggling', segment_label: 'Struggling' },
    ],
    segment_summary: [
      { segment: 'fast_accurate', label: 'Fast & Accurate', description: 'Quick responses with high accuracy', user_count: 5, avg_accuracy: 85.0, avg_response_ms: 3200 },
      { segment: 'slow_accurate', label: 'Slow & Accurate', description: 'Deliberate responses with high accuracy', user_count: 5, avg_accuracy: 78.0, avg_response_ms: 8500 },
      { segment: 'fast_inaccurate', label: 'Fast & Inaccurate', description: 'Quick responses but low accuracy', user_count: 5, avg_accuracy: 42.0, avg_response_ms: 2800 },
      { segment: 'struggling', label: 'Struggling', description: 'Slow responses with low accuracy', user_count: 5, avg_accuracy: 35.0, avg_response_ms: 12000 },
    ],
    srs_impact_by_segment: [
      {
        segment: 'fast_accurate', label: 'Fast & Accurate', user_count: 5,
        box_distribution: { '0': 5, '1': 8, '2': 12, '3': 15, '4': 20 },
        retention_by_box: [
          { box_level: 0, retention: 65.0, count: 5 },
          { box_level: 1, retention: 78.0, count: 8 },
          { box_level: 2, retention: 85.0, count: 12 },
          { box_level: 3, retention: 92.0, count: 15 },
          { box_level: 4, retention: 97.0, count: 20 },
        ],
      },
      {
        segment: 'struggling', label: 'Struggling', user_count: 5,
        box_distribution: { '0': 25, '1': 10, '2': 3, '3': 1, '4': 0 },
        retention_by_box: [
          { box_level: 0, retention: 22.0, count: 25 },
          { box_level: 1, retention: 35.0, count: 10 },
          { box_level: 2, retention: 48.0, count: 3 },
          { box_level: 3, retention: 55.0, count: 1 },
          { box_level: 4, retention: null, count: 0 },
        ],
      },
    ],
  },
}

// ─── Analytics Route Interception Helpers ───

export async function mockAnalyticsAPI(page: Page) {
  await page.route(`${API_BASE}/admin/analytics/overview`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockAnalyticsOverview) }),
  )
  await page.route(`${API_BASE}/admin/analytics/topic_accuracy*`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockTopicAccuracy) }),
  )
  await page.route(`${API_BASE}/admin/analytics/engagement*`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockEngagement) }),
  )
  await page.route(`${API_BASE}/admin/analytics/response_times*`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockResponseTimes) }),
  )
  await page.route(`${API_BASE}/admin/analytics/retention_curves`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockRetentionCurves) }),
  )
  await page.route(`${API_BASE}/admin/analytics/learner_segments`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(mockLearnerSegments) }),
  )
}

export async function mockAnalyticsErrorAPI(page: Page) {
  const endpoints = ['overview', 'topic_accuracy', 'engagement', 'response_times', 'retention_curves', 'learner_segments']
  for (const ep of endpoints) {
    await page.route(`${API_BASE}/admin/analytics/${ep}*`, (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Internal Server Error"}' }),
    )
  }
}
