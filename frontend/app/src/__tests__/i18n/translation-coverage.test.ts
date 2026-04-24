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
