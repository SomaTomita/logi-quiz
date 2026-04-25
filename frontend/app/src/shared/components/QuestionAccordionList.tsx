import { memo, type ReactNode } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  Typography,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useTranslation } from 'react-i18next'

interface QuestionItem {
  questionText: string
  choices: { choiceText: string; isCorrect: boolean }[]
  explanation: { explanationText: string }
}

interface QuestionAccordionListProps {
  questions: QuestionItem[]
  correctIndices: number[]
  userAnswers: (string | null)[]
  /** Extra chips to render per question (e.g. SRS box level) */
  extraChip?: (index: number) => ReactNode
}

const QuestionAccordionList = memo(
  ({ questions, correctIndices, userAnswers, extraChip }: QuestionAccordionListProps) => {
    const { t } = useTranslation()
    const correctSet = new Set(correctIndices)

    return (
      <>
        {questions.map((item, index) => {
          const correctAnswer = item.choices.find((c) => c.isCorrect)?.choiceText ?? ''
          const isCorrect = correctSet.has(index)

          return (
            <Accordion
              key={index}
              disableGutters
              sx={{
                mb: 1,
                '&:before': { display: 'none' },
                border: '1px solid',
                borderColor: isCorrect ? 'success.main' : 'error.main',
                borderRadius: '12px !important',
                overflow: 'hidden',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ '& .MuiAccordionSummary-content': { minWidth: 0, overflow: 'hidden' } }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {isCorrect ? (
                    <CheckCircleRoundedIcon
                      sx={{ color: 'success.main', fontSize: 22, flexShrink: 0 }}
                    />
                  ) : (
                    <CancelRoundedIcon sx={{ color: 'error.main', fontSize: 22, flexShrink: 0 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, flexShrink: 0, color: 'text.primary' }}
                  >
                    {t('common.questionLabel', { number: index + 1 })}
                  </Typography>
                  <Chip
                    label={isCorrect ? t('common.correct') : t('common.incorrect')}
                    size="small"
                    color={isCorrect ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.7rem', flexShrink: 0 }}
                  />
                  {extraChip?.(index)}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      ml: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    {item.questionText}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>
                  {item.questionText}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('common.correctAnswer', { answer: correctAnswer })}
                </Typography>
                <Typography
                  variant="body2"
                  color={isCorrect ? 'text.secondary' : 'error.main'}
                  sx={{ mb: 1.5 }}
                >
                  {userAnswers[index]
                    ? t('common.yourAnswer', { answer: userAnswers[index] })
                    : t('common.unanswered')}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ pt: 1.5, borderTop: '1px solid', borderColor: 'divider', lineHeight: 1.7 }}
                >
                  {item.explanation.explanationText}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </>
    )
  },
)

QuestionAccordionList.displayName = 'QuestionAccordionList'

export default QuestionAccordionList
