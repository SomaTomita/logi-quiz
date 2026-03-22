import { useReducer, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Alert, Chip } from '@mui/material'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import Loading from '@/shared/components/Loading'
import ScoreRing from '@/shared/components/ScoreRing'
import ConfirmDialog from '@/shared/components/ConfirmDialog'
import SessionTopBar from '@/shared/components/SessionTopBar'
import ChoiceList from '@/shared/components/ChoiceList'
import QuestionAccordionList from '@/shared/components/QuestionAccordionList'
import { shuffleArray } from '@/shared/utils/array'
import { fetchReviewQueue, completeReview } from '../api'
import type { ReviewQuestion, ReviewCompleteResult } from '../types'

const BOX_LABELS = ['毎日', '3日後', '1週間後', '2週間後', '1ヶ月後']

// --- State & Reducer ---

type Phase = 'loading' | 'queue' | 'session' | 'result'

interface State {
  phase: Phase
  questions: ReviewQuestion[]
  totalDue: number
  error: string | null
  currentIndex: number
  answerIndex: number | null
  correctIndices: number[]
  userAnswers: string[]
  userChoiceIds: (number | null)[]
  confirmExit: boolean
  reviewResults: ReviewCompleteResult[]
}

const initialState: State = {
  phase: 'loading',
  questions: [],
  totalDue: 0,
  error: null,
  currentIndex: 0,
  answerIndex: null,
  correctIndices: [],
  userAnswers: [],
  userChoiceIds: [],
  confirmExit: false,
  reviewResults: [],
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; questions: ReviewQuestion[]; totalDue: number }
  | { type: 'LOAD_ERROR'; error: string }
  | { type: 'START_SESSION' }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'NEXT'; correctIndices: number[]; userAnswers: string[]; userChoiceIds: (number | null)[] }
  | { type: 'FINISH'; correctIndices: number[]; userAnswers: string[]; userChoiceIds: (number | null)[] }
  | { type: 'SET_RESULTS'; results: ReviewCompleteResult[] }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_CONFIRM_EXIT'; open: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...initialState, phase: 'loading' }
    case 'LOAD_SUCCESS':
      return { ...state, phase: 'queue', questions: action.questions, totalDue: action.totalDue, error: null }
    case 'LOAD_ERROR':
      return { ...state, phase: 'queue', error: action.error }
    case 'START_SESSION':
      return { ...state, phase: 'session', currentIndex: 0, answerIndex: null, correctIndices: [], userAnswers: [], userChoiceIds: [] }
    case 'SELECT_ANSWER':
      return { ...state, answerIndex: action.index }
    case 'NEXT':
      return { ...state, currentIndex: state.currentIndex + 1, answerIndex: null, correctIndices: action.correctIndices, userAnswers: action.userAnswers, userChoiceIds: action.userChoiceIds }
    case 'FINISH':
      return { ...state, phase: 'result', correctIndices: action.correctIndices, userAnswers: action.userAnswers, userChoiceIds: action.userChoiceIds }
    case 'SET_RESULTS':
      return { ...state, reviewResults: action.results }
    case 'SET_ERROR':
      return { ...state, error: action.error }
    case 'SET_CONFIRM_EXIT':
      return { ...state, confirmExit: action.open }
    default:
      return state
  }
}

// --- Component ---

const ReviewPage = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadQueue = useCallback(() => {
    dispatch({ type: 'LOAD_START' })
    fetchReviewQueue()
      .then((res) => {
        const data = res.data
        const shuffled = data.reviewQuestions.map((q) => ({
          ...q,
          choices: shuffleArray(q.choices),
        }))
        dispatch({ type: 'LOAD_SUCCESS', questions: shuffled, totalDue: data.totalDue })
      })
      .catch(() => {
        dispatch({ type: 'LOAD_ERROR', error: '復習データの読み込みに失敗しました。' })
      })
  }, [])

  useEffect(() => {
    loadQueue()
  }, [loadQueue])

  const currentQuestion = state.questions[state.currentIndex] ?? null
  const isLastQuestion = state.currentIndex === state.questions.length - 1

  const handleNext = () => {
    if (!currentQuestion || state.answerIndex === null) return

    const choice = currentQuestion.choices[state.answerIndex]
    const isCorrect = choice.isCorrect
    const newCorrectIndices = isCorrect ? [...state.correctIndices, state.currentIndex] : state.correctIndices
    const newUserAnswers = [...state.userAnswers, choice.choiceText]
    const newUserChoiceIds = [...state.userChoiceIds, choice.id]

    if (!isLastQuestion) {
      dispatch({ type: 'NEXT', correctIndices: newCorrectIndices, userAnswers: newUserAnswers, userChoiceIds: newUserChoiceIds })
    } else {
      dispatch({ type: 'FINISH', correctIndices: newCorrectIndices, userAnswers: newUserAnswers, userChoiceIds: newUserChoiceIds })

      const questionResults = state.questions.map((q, i) => ({
        questionId: q.id,
        choiceId: newUserChoiceIds[i] ?? null,
        correct: newCorrectIndices.includes(i),
      }))

      completeReview(questionResults)
        .then((res) => dispatch({ type: 'SET_RESULTS', results: res.data.results }))
        .catch(() => dispatch({ type: 'SET_ERROR', error: '復習結果の保存に失敗しました。' }))
    }
  }

  // Loading
  if (state.phase === 'loading') return <Loading />

  // Queue overview
  if (state.phase === 'queue') {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
        {state.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          復習
        </Typography>

        {state.questions.length > 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ReplayRoundedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {state.totalDue}問
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              復習すべき問題があります
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => dispatch({ type: 'START_SESSION' })}
              sx={{ px: 5 }}
            >
              復習を始める
            </Button>
          </Paper>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CheckCircleRoundedIcon sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              復習完了！
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              現在、復習すべき問題はありません。クイズに挑戦して問題を追加しましょう。
            </Typography>
            <Button variant="outlined" size="large" onClick={() => navigate('/sections')} sx={{ px: 4 }}>
              セクション一覧へ
            </Button>
          </Paper>
        )}
      </Box>
    )
  }

  // Active session
  if (state.phase === 'session' && currentQuestion) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1300,
            bgcolor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
        >
          <SessionTopBar
            currentIndex={state.currentIndex}
            totalCount={state.questions.length}
            onExit={() => dispatch({ type: 'SET_CONFIRM_EXIT', open: true })}
            centerExtra={<Chip label="復習" size="small" color="primary" variant="outlined" />}
          />

          {/* Question content */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              maxWidth: 640,
              width: '100%',
              mx: 'auto',
              px: { xs: 2, sm: 4 },
              py: 4,
            }}
          >
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', lineHeight: 1.6 }}>
              {currentQuestion.questionText}
            </Typography>

            <ChoiceList
              choices={currentQuestion.choices}
              selectedIndex={state.answerIndex}
              onSelect={(index) => dispatch({ type: 'SELECT_ANSWER', index })}
            />

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                disabled={state.answerIndex === null}
                sx={{ px: 5 }}
              >
                {isLastQuestion ? '完了' : '次へ'}
              </Button>
            </Box>
          </Box>
        </Box>

        <ConfirmDialog
          open={state.confirmExit}
          title="復習を退出しますか？"
          message="進行中の復習の結果は保存されません。"
          onCancel={() => dispatch({ type: 'SET_CONFIRM_EXIT', open: false })}
          onConfirm={() => {
            dispatch({ type: 'SET_CONFIRM_EXIT', open: false })
            navigate('/review')
            loadQueue()
          }}
        />
      </>
    )
  }

  // Result
  if (state.phase === 'result') {
    const percentage =
      state.questions.length > 0 ? (state.correctIndices.length / state.questions.length) * 100 : 0
    const getMessage = () => {
      if (percentage >= 80) return '素晴らしい！'
      if (percentage >= 50) return 'いい調子！'
      return 'もう一度挑戦しよう！'
    }

    return (
      <Box sx={{ maxWidth: 640, mx: 'auto' }}>
        {state.error && (
          <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ScoreRing correct={state.correctIndices.length} total={state.questions.length} />
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
            {getMessage()}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {state.questions.length}問中{state.correctIndices.length}問正解
          </Typography>
        </Box>

        <Typography variant="h5" sx={{ mb: 2 }}>
          復習結果
        </Typography>

        <QuestionAccordionList
          questions={state.questions}
          correctIndices={state.correctIndices}
          userAnswers={state.userAnswers}
          extraChip={(index) => {
            const result = state.reviewResults.find(
              (r) => r.questionId === state.questions[index].id,
            )
            return result ? (
              <Chip
                label={`次回: ${BOX_LABELS[result.boxLevel]}`}
                size="small"
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', flexShrink: 0 }}
              />
            ) : null
          }}
        />

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2, pb: 4 }}>
          <Button variant="contained" size="large" onClick={loadQueue} sx={{ px: 4 }}>
            続けて復習
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/sections')} sx={{ px: 4 }}>
            セクション一覧へ
          </Button>
        </Box>
      </Box>
    )
  }

  return <Loading />
}

export default ReviewPage
