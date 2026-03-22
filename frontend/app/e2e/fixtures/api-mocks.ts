import type { Page } from '@playwright/test'

// API base URL — must match VITE_API_BASE_URL used by the app
const API_BASE = 'http://localhost:3001'

// ─── Mock Data (snake_case — axios-case-converter transforms to camelCase) ───

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
