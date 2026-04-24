import { useEffect, useRef } from 'react'
import i18n from '@/i18n'
import { useQuizSessionStore } from './store'
import { fetchQuizzes } from './api'
import { saveDashboardData } from '@/features/dashboard/api'
import { useAuthStore } from '@/features/auth/store'

/**
 * Manages quiz lifecycle effects (fetch, timer, save).
 * Uses granular Zustand selectors so the 1-second `tick()` update
 * does NOT re-render the entire quiz tree.
 */
export const useQuizSession = (sectionId: string) => {
  // --- Actions (stable references, never trigger re-renders) ---
  const reset = useQuizSessionStore((s) => s.reset)
  const loadQuestions = useQuizSessionStore((s) => s.loadQuestions)
  const setFetchError = useQuizSessionStore((s) => s.setFetchError)
  const setSaveError = useQuizSessionStore((s) => s.setSaveError)
  const tick = useQuizSessionStore((s) => s.tick)

  // --- Reactive state (only what effects depend on) ---
  const isStarted = useQuizSessionStore((s) => s.isStarted)
  const showResult = useQuizSessionStore((s) => s.showResult)

  // Save-effect dependencies (change only at quiz end, not every second)
  const questions = useQuizSessionStore((s) => s.questions)
  const correctIndices = useQuizSessionStore((s) => s.correctIndices)
  const userChoiceIds = useQuizSessionStore((s) => s.userChoiceIds)
  const elapsedSeconds = useQuizSessionStore((s) => s.elapsedSeconds)
  const sectionClearCount = useQuizSessionStore((s) => s.sectionClearCount)

  const user = useAuthStore((s) => s.user)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // Reset store and fetch quizzes on mount / sectionId change
  useEffect(() => {
    reset()
    fetchQuizzes(sectionId)
      .then((res) => loadQuestions(res.data))
      .catch((err) => {
        console.error('Error fetching quizzes:', err)
        setFetchError(i18n.t('quiz.loadError'))
      })
  }, [sectionId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Play timer — only re-runs when isStarted / showResult change
  useEffect(() => {
    if (isStarted && !showResult) {
      timerRef.current = setInterval(() => tick(), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [isStarted, showResult, tick])

  // Save dashboard data when quiz completed
  useEffect(() => {
    if (!showResult || !user) return

    const correctSet = new Set(correctIndices)
    const questionResults = questions.map((q, i) => ({
      questionId: q.id,
      choiceId: userChoiceIds[i] ?? null,
      correct: correctSet.has(i),
    }))

    saveDashboardData({
      playTime: elapsedSeconds,
      questionsCleared: correctIndices.length,
      sectionResult: {
        sectionId,
        correctAnswers: correctIndices.length,
      },
      learningStack: {
        date: new Date().toISOString().split('T')[0],
        totalClear: sectionClearCount,
      },
      questionResults,
    })
      .then(() => setSaveError(null))
      .catch((err) => {
        console.error('Error saving dashboard data:', err)
        setSaveError(i18n.t('quiz.saveErrorAlert'))
      })
  }, [showResult]) // eslint-disable-line react-hooks/exhaustive-deps
}
