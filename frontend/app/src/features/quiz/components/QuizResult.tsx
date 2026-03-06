import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ScoreRing from '@/shared/components/ScoreRing'
import LoginPromptModal from '@/shared/components/LoginPromptModal'
import { useAuthStore } from '@/features/auth/store'
import { useGuestStore } from '@/features/auth/guestStore'
import type { Quiz } from '../types'

interface QuizResultProps {
  questions: Quiz[]
  correctIndices: number[]
  userAnswers: string[]
  onTryAgain: () => void
  onBackToSections: () => void
  saveError?: string | null
  sectionId: string
}

const QuizResult = memo(
  ({
    questions,
    correctIndices,
    userAnswers,
    onTryAgain,
    onBackToSections,
    saveError,
    sectionId,
  }: QuizResultProps) => {
    const navigate = useNavigate()
    const isSignedIn = useAuthStore((s) => s.isSignedIn)
    const incrementCompletionCount = useGuestStore((s) => s.incrementCompletionCount)
    const showLoginPrompt = useGuestStore((s) => s.showLoginPrompt)
    const dismissLoginPrompt = useGuestStore((s) => s.dismissLoginPrompt)

    // Increment guest quiz count on mount (only for non-signed-in users)
    useEffect(() => {
      if (!isSignedIn) {
        incrementCompletionCount()
      }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const percentage = questions.length > 0 ? (correctIndices.length / questions.length) * 100 : 0
    const getMessage = () => {
      if (percentage >= 80) return '素晴らしい！'
      if (percentage >= 50) return 'いい調子！'
      return 'もう一度挑戦しよう！'
    }

    return (
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        {saveError && (
          <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
            学習記録の保存に失敗しました。結果はこのページで確認できます。
          </Alert>
        )}

        {/* Score display */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ScoreRing correct={correctIndices.length} total={questions.length} />
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
            {getMessage()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {questions.length}問中{correctIndices.length}問正解
          </Typography>
        </Box>

        {/* Question review accordion */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          問題の振り返り
        </Typography>
        {questions.map((item, index) => {
          const correctAnswer = item.choices.find((c) => c.isCorrect)?.choiceText ?? ''
          const isCorrect = correctIndices.includes(index)

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
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    minWidth: 0,
                    width: '100%',
                    pr: 1,
                  }}
                >
                  {isCorrect ? (
                    <CheckCircleRoundedIcon
                      sx={{ color: 'success.main', fontSize: 20, flexShrink: 0 }}
                    />
                  ) : (
                    <CancelRoundedIcon sx={{ color: 'error.main', fontSize: 20, flexShrink: 0 }} />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 600, flexShrink: 0 }}>
                    問{index + 1}
                  </Typography>
                  <Chip
                    label={isCorrect ? '正解' : '不正解'}
                    size="small"
                    color={isCorrect ? 'success' : 'error'}
                    variant="outlined"
                    sx={{ height: 22, fontSize: '0.7rem', flexShrink: 0 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      ml: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
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
                  正解: {correctAnswer}
                </Typography>
                <Typography
                  variant="body2"
                  color={isCorrect ? 'text.secondary' : 'error.main'}
                  sx={{ mb: 1.5 }}
                >
                  あなたの回答: {userAnswers[index] ?? '未回答'}
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

        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, pb: 4 }}>
          <Button variant="contained" size="large" onClick={onTryAgain} sx={{ px: 4 }}>
            もう一度
          </Button>
          <Button variant="outlined" size="large" onClick={onBackToSections} sx={{ px: 4 }}>
            セクション一覧へ
          </Button>
        </Box>

        <LoginPromptModal
          open={showLoginPrompt}
          onClose={() => {
            dismissLoginPrompt()
            navigate('/sections')
          }}
        />
      </Box>
    )
  },
)

QuizResult.displayName = 'QuizResult'

export default QuizResult
