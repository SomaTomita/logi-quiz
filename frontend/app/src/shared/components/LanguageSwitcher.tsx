import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton, Menu, MenuItem, ListItemText, Typography } from '@mui/material'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'

const languages = [
  { code: 'ja', label: '日本語' },
  { code: 'en', label: 'English' },
] as const

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        aria-label={t('language.changeLanguageLabel')}
        sx={{ color: 'text.secondary' }}
      >
        <LanguageRoundedIcon fontSize="small" />
        <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>
          {i18n.language === 'ja' ? 'JA' : 'EN'}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{ paper: { sx: { minWidth: 140, borderRadius: 2 } } }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            selected={i18n.language === lang.code}
          >
            <ListItemText>{lang.label}</ListItemText>
            {i18n.language === lang.code && (
              <CheckRoundedIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSwitcher
