import en from '../../i18n/locales/en/translation.json'
import ja from '../../i18n/locales/ja/translation.json'

test('both locale files load', () => {
  expect(en).toBeDefined()
  expect(ja).toBeDefined()
})
