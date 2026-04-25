import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import i18n from '../../i18n'
import CreateQuizPage from '../../features/admin/pages/CreateQuizPage'

vi.mock('../../features/admin/hooks', () => ({
  useAdminSections: () => ({
    sections: [{ id: 1, sectionName: 'JS Basics', locale: 'en' }],
    isLoading: false,
  }),
}))

beforeEach(() => i18n.changeLanguage('en'))

test('shows validation error when question text is empty on submit', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <CreateQuizPage />
      </I18nextProvider>
    </MemoryRouter>
  )

  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(await screen.findByText(/question text is required/i)).toBeInTheDocument()
})
