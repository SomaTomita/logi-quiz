import { memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Alert } from '@mui/material'
import ScoreRing from '@/shared/components/ScoreRing'
import LoginPromptModal from '@/shared/components/LoginPromptModal'
import QuestionAccordionList from '@/shared/components/QuestionAccordionList'
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
}

const QuizResult = memo(
  ({
    questions,
    correctIndices,
    userAnswers,
    onTryAgain,
    onBackToSections,
    saveError,
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

        {isSignedIn && !saveError && (
          <Alert severity="success" variant="outlined" sx={{ mb: 3 }}>
            回答履歴が復習キューに記録されました
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
        <QuestionAccordionList
          questions={questions}
          correctIndices={correctIndices}
          userAnswers={userAnswers}
        />

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
