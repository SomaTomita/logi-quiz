import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import LanguageSwitcher from '../../shared/components/LanguageSwitcher'

beforeEach(async () => {
  await i18n.changeLanguage('ja')
})

test('displays JA badge when language is Japanese', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
    </I18nextProvider>
  )
  expect(screen.getByText('JA')).toBeInTheDocument()
})

test('displays EN badge after switching to English', async () => {
  const user = userEvent.setup()
  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
    </I18nextProvider>
  )

  await user.click(screen.getByRole('button', { name: /change language/i }))
  await user.click(screen.getByRole('menuitem', { name: 'English' }))

  expect(screen.getByText('EN')).toBeInTheDocument()
})

test('displays JA badge after switching back to Japanese', async () => {
  const user = userEvent.setup()
  await i18n.changeLanguage('en')
  render(
    <I18nextProvider i18n={i18n}>
      <LanguageSwitcher />
    </I18nextProvider>
  )

  await user.click(screen.getByRole('button', { name: /change language/i }))
  await user.click(screen.getByRole('menuitem', { name: '日本語' }))

  expect(screen.getByText('JA')).toBeInTheDocument()
})
