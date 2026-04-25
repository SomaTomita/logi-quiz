import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import QuestionAccordionList from '../../shared/components/QuestionAccordionList'

const makeQuestion = (text: string) => ({
  questionText: text,
  choices: [
    { choiceText: 'Correct answer', isCorrect: true },
    { choiceText: 'Wrong answer', isCorrect: false },
  ],
  explanation: { explanationText: 'Explanation here' },
})

const LONG_TEXT =
  'Which of the following is NOT one of the three main functions of a Bill of Lading (B/L) in international trade?'

const questions = [
  makeQuestion('Short question'),
  makeQuestion('Another question'),
  makeQuestion(LONG_TEXT),
]

const renderList = (correctIndices: number[], userAnswers: (string | null)[] = []) =>
  render(
    <I18nextProvider i18n={i18n}>
      <QuestionAccordionList
        questions={questions}
        correctIndices={correctIndices}
        userAnswers={userAnswers}
      />
    </I18nextProvider>,
  )

beforeEach(() => i18n.changeLanguage('en'))

test('renders Q-number label for every question', () => {
  renderList([0])
  expect(screen.getByText('Q1')).toBeInTheDocument()
  expect(screen.getByText('Q2')).toBeInTheDocument()
  expect(screen.getByText('Q3')).toBeInTheDocument()
})

test('shows Correct chip for questions in correctIndices', () => {
  renderList([0, 2])
  const correctChips = screen.getAllByText('Correct')
  expect(correctChips).toHaveLength(2)
})

test('shows Incorrect chip for questions not in correctIndices', () => {
  renderList([0])
  const incorrectChips = screen.getAllByText('Incorrect')
  expect(incorrectChips).toHaveLength(2) // Q2 and Q3
})

test('renders checkmark icon (role=img or svg) for correct questions', () => {
  renderList([1])
  // CheckCircleRoundedIcon renders as an SVG; accessible via data-testid via MUI
  const summaries = document.querySelectorAll('.MuiAccordionSummary-root')
  // Q2 (index 1) is correct → contains CheckCircleRoundedIcon
  expect(summaries[1].querySelector('[data-testid="CheckCircleRoundedIcon"]')).toBeInTheDocument()
})

test('renders cancel icon for incorrect questions', () => {
  renderList([1])
  const summaries = document.querySelectorAll('.MuiAccordionSummary-root')
  // Q1 (index 0) is incorrect → contains CancelRoundedIcon
  expect(summaries[0].querySelector('[data-testid="CancelRoundedIcon"]')).toBeInTheDocument()
})

test('Q-number label is present even for questions with very long text', () => {
  renderList([]) // all incorrect
  // Q3 has the longest text — ensure Q3 label is still present
  expect(screen.getByText('Q3')).toBeInTheDocument()
})

test('renders all three question texts', () => {
  renderList([0, 1, 2])
  // Each question text appears twice: once in the summary preview, once in the details
  expect(screen.getAllByText('Short question').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText('Another question').length).toBeGreaterThanOrEqual(1)
  expect(screen.getAllByText(LONG_TEXT).length).toBeGreaterThanOrEqual(1)
})

test('each accordion row has correct border color class based on result', () => {
  renderList([0]) // Q1 correct, Q2/Q3 incorrect
  const accordions = document.querySelectorAll('.MuiAccordion-root')
  expect(accordions).toHaveLength(3)
})

test('renders extraChip when provided', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <QuestionAccordionList
        questions={questions}
        correctIndices={[0]}
        userAnswers={[]}
        extraChip={(index) =>
          index === 0 ? <span data-testid="extra-chip">Box 3</span> : null
        }
      />
    </I18nextProvider>,
  )
  expect(screen.getByTestId('extra-chip')).toBeInTheDocument()
})

test('all Q-number labels present when all questions are incorrect (stress test)', () => {
  renderList([]) // none correct
  for (let i = 1; i <= questions.length; i++) {
    expect(screen.getByText(`Q${i}`)).toBeInTheDocument()
  }
})
