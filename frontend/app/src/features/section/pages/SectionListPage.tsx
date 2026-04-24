import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Typography, Box, Paper, Button, TextField, InputAdornment, Alert } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import PageHeader from '@/shared/components/PageHeader'
import { useSections } from '../hooks'
import SectionCard from '../components/SectionCard'
import { useAuthStore } from '@/features/auth/store'
import { useGuestStore } from '@/features/auth/guestStore'
import LoginPromptModal from '@/shared/components/LoginPromptModal'

const SectionListPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { sections, isLoading, error } = useSections()
  const [search, setSearch] = useState('')
  const isSignedIn = useAuthStore((s) => s.isSignedIn)
  const canPlayQuiz = useGuestStore((s) => s.canPlayQuiz)
  const showLoginPrompt = useGuestStore((s) => s.showLoginPrompt)
  const dismissLoginPrompt = useGuestStore((s) => s.dismissLoginPrompt)

  const filtered = useMemo(() => {
    if (!search.trim()) return sections
    const q = search.toLowerCase()
    return sections.filter((s) => s.sectionName.toLowerCase().includes(q))
  }, [sections, search])

  const handleSectionClick = (sectionId: number) => {
    if (!isSignedIn && !canPlayQuiz()) {
      useGuestStore.setState({ showLoginPrompt: true })
      return
    }
    navigate(`/quiz/${sectionId}`)
  }

  return (
    <>
      <PageHeader
        title={t('section.pageTitle')}
        subtitle={sections.length > 0 ? t('section.sectionCount', { count: sections.length }) : undefined}
      />

      {!isSignedIn && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('section.guestTrialAlert', { count: 3 })}
        </Alert>
      )}

      {error ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <ErrorOutlineIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {t('section.loadError')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t('common.networkError')}
          </Typography>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            {t('common.reload')}
          </Button>
        </Paper>
      ) : (
        <>
          {sections.length > 6 && (
            <TextField
              fullWidth
              placeholder={t('section.searchPlaceholder')}
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
          )}
          <SectionCard
            sections={filtered}
            onSectionClick={handleSectionClick}
            isLoading={isLoading}
          />
        </>
      )}

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => {
          dismissLoginPrompt()
          navigate('/sections')
        }}
      />
    </>
  )
}

export default SectionListPage
