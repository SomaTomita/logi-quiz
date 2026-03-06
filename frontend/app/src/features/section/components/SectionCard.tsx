import { memo } from 'react'
import { Grid, Paper, Typography, Skeleton } from '@mui/material'
import { styled } from '@mui/system'
import type { Section } from '../types'

const StyledPaper = styled(Paper)({
  fontSize: '16px',
  textAlign: 'center',
  padding: '24px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  borderLeft: '4px solid #0d9488',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)',
  },
})

interface SectionCardProps {
  sections: Section[]
  onSectionClick: (sectionId: number) => void
  isLoading: boolean
}

const SectionCard = memo(({ sections, onSectionClick, isLoading }: SectionCardProps) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (sections.length === 0) {
    return <Typography color="text.secondary">セクションがありません</Typography>
  }

  return (
    <Grid container spacing={3} sx={{ fontSize: '1.1rem' }}>
      {sections.map((section) => (
        <Grid item xs={12} sm={6} key={section.id}>
          <StyledPaper
            elevation={2}
            onClick={() => onSectionClick(section.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') onSectionClick(section.id)
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {section.sectionName}
            </Typography>
          </StyledPaper>
        </Grid>
      ))}
    </Grid>
  )
})

SectionCard.displayName = 'SectionCard'

export default SectionCard
