import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../i18n'
import SignInPage from '../../features/auth/pages/SignInPage'
import SignUpPage from '../../features/auth/pages/SignUpPage'
import en from '../../i18n/locales/en/translation.json'
import ja from '../../i18n/locales/ja/translation.json'

test('both locale files load', () => {
  expect(en).toBeDefined()
  expect(ja).toBeDefined()
})

test('home section: no untranslated keys', () => {
  expect(ja.home.goToSections).not.toBe(en.home.goToSections)
  expect(ja.home.step5Title).not.toBe(en.home.step5Title)
  expect(ja.home.step6Title).not.toBe(en.home.step6Title)
  expect(ja.home.goToDashboard).not.toBe(en.home.goToDashboard)
})

test('dashboard section: no untranslated keys', () => {
  expect(ja.dashboard.less).not.toBe(en.dashboard.less)
  expect(ja.dashboard.more).not.toBe(en.dashboard.more)
})

const adminEnglishKeys = [
  'createQuizTitle', 'editQuizFab', 'editQuizTitle',
  'deleteQuizConfirmTitle', 'deleteQuizConfirmMessage',
  'createSectionTitle', 'editSectionFab', 'editSectionTitle',
  'deleteSectionConfirmTitle', 'deleteSectionConfirmMessage',
  'updateQuizQuestionLabel', 'updateQuizChoiceLabel',
  'updateQuizIsCorrectLabel', 'updateQuizExplanationLabel',
  'saveChanges', 'saveSuccess', 'saveError',
] as const

adminEnglishKeys.forEach((key) => {
  test(`admin.${key} is not English in ja locale`, () => {
    expect((ja.admin as Record<string, string>)[key]).not.toBe(
      (en.admin as Record<string, string>)[key]
    )
  })
})

const navHeaderKeys = [
  'headerSections', 'headerDashboard', 'headerSignOut',
  'headerSignIn', 'headerSignUp', 'headerCreateQuiz', 'headerCreateSection',
] as const

navHeaderKeys.forEach((key) => {
  test(`nav.${key} is not English in ja locale`, () => {
    expect((ja.nav as Record<string, string>)[key]).not.toBe(
      (en.nav as Record<string, string>)[key]
    )
  })
})

test('SignInPage validation messages update after language switch', async () => {
  const user = userEvent.setup()
  await i18n.changeLanguage('en')

  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <SignInPage />
      </I18nextProvider>
    </MemoryRouter>
  )

  // Submit empty to trigger English errors
  await user.click(screen.getByRole('button', { name: /sign in/i }))
  expect(await screen.findByText('Please enter your email address')).toBeInTheDocument()

  // Switch to Japanese
  await i18n.changeLanguage('ja')

  // Should now show Japanese without re-submitting
  await waitFor(() => {
    expect(screen.queryByText('Please enter your email address')).not.toBeInTheDocument()
  })
  expect(screen.getByText('メールアドレスを入力してください')).toBeInTheDocument()
})

test('SignUpPage validation messages update after language switch', async () => {
  const user = userEvent.setup()
  await i18n.changeLanguage('en')

  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <SignUpPage />
      </I18nextProvider>
    </MemoryRouter>
  )

  await user.click(screen.getByRole('button', { name: /sign up/i }))
  expect(await screen.findByText('Please enter your name')).toBeInTheDocument()

  await i18n.changeLanguage('ja')

  await waitFor(() => {
    expect(screen.queryByText('Please enter your name')).not.toBeInTheDocument()
  })
  expect(screen.getByText('名前を入力してください')).toBeInTheDocument()
})
