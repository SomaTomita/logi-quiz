import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router-dom'
import i18n from '../../i18n'
import CreateSectionPage from '../../features/admin/pages/CreateSectionPage'

beforeEach(() => i18n.changeLanguage('en'))

test('shows validation error when submitted with empty section name', async () => {
  const user = userEvent.setup()
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <CreateSectionPage />
      </I18nextProvider>
    </MemoryRouter>
  )

  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(await screen.findByText(/section name is required/i)).toBeInTheDocument()
})
