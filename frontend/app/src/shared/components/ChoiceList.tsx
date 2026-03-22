import { memo } from 'react'
import { Box, Paper, Typography } from '@mui/material'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

interface ChoiceItem {
  id?: number
  choiceText: string
}

interface ChoiceListProps {
  choices: ChoiceItem[]
  selectedIndex: number | null
  onSelect: (index: number) => void
}

const ChoiceList = memo(({ choices, selectedIndex, onSelect }: ChoiceListProps) => (
  <Box component="div" role="radiogroup" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    {choices.map((choice, index) => {
      const isSelected = selectedIndex === index
      return (
        <Paper
          key={choice.id ?? choice.choiceText}
          component="button"
          role="radio"
          aria-checked={isSelected}
          onClick={() => onSelect(index)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            px: 3,
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            bgcolor: isSelected ? 'primary.main' : 'background.paper',
            color: isSelected ? '#fff' : 'text.primary',
            borderColor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.08)',
            '&:hover': {
              bgcolor: isSelected ? 'primary.main' : 'rgba(79, 70, 229, 0.04)',
              borderColor: 'primary.main',
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: 2,
            },
            transition: 'background-color 150ms ease, border-color 150ms ease, color 150ms ease',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(79, 70, 229, 0.08)',
              color: isSelected ? '#fff' : 'primary.main',
              fontWeight: 700,
              fontSize: '0.85rem',
              flexShrink: 0,
            }}
          >
            {CHOICE_LABELS[index]}
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {choice.choiceText}
          </Typography>
        </Paper>
      )
    })}
  </Box>
))

ChoiceList.displayName = 'ChoiceList'

export default ChoiceList
