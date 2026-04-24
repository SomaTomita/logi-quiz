import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, Paper, Typography, Skeleton, Box } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import EmptyState from '@/shared/components/EmptyState'
import type { Section } from '../types'

interface SectionCardProps {
  sections: Section[]
  onSectionClick: (sectionId: number) => void
  isLoading: boolean
}

const SectionCard = memo(({ sections, onSectionClick, isLoading }: SectionCardProps) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rectangular" height={88} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (sections.length === 0) {
    return (
      <EmptyState
        title={t('section.emptyTitle')}
        description={t('section.emptyDescription')}
      />
    )
  }

  return (
    <Grid container spacing={2}>
      {sections.map((section) => (
        <Grid item xs={12} sm={6} md={4} key={section.id}>
          <Paper
            component="button"
            onClick={() => onSectionClick(section.id)}
            sx={{
              p: 3,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left',
              bgcolor: 'background.paper',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                transform: 'translateY(-2px)',
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {section.sectionName}
            </Typography>
            <ArrowForwardRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
})

SectionCard.displayName = 'SectionCard'

export default SectionCard
