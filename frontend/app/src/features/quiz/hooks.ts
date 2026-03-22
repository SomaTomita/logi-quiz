import { useEffect, useRef } from 'react'
import { useQuizSessionStore } from './store'
import { fetchQuizzes } from './api'
import { saveDashboardData } from '@/features/dashboard/api'
import { useAuthStore } from '@/features/auth/store'

export const useQuizSession = (sectionId: string) => {
  const store = useQuizSessionStore()
  const user = useAuthStore((s) => s.user)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // Reset store and fetch quizzes on mount / sectionId change
  useEffect(() => {
    store.reset()
    fetchQuizzes(sectionId)
      .then((res) => store.loadQuestions(res.data))
      .catch((err) => {
        console.error('Error fetching quizzes:', err)
        store.setFetchError(
          'クイズの読み込みに失敗しました。ページを再読み込みしてお試しください。',
        )
      })
  }, [sectionId])

  // Play timer
  useEffect(() => {
    if (store.isStarted && !store.showResult) {
      timerRef.current = setInterval(() => store.tick(), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [store.isStarted, store.showResult])

  // Save dashboard data when quiz completed
  useEffect(() => {
    if (!store.showResult || !user) return

    const questionResults = store.questions.map((q, i) => ({
      questionId: q.id,
      choiceId: store.userChoiceIds[i] ?? null,
      correct: store.correctIndices.includes(i),
    }))

    saveDashboardData({
      playTime: store.elapsedSeconds,
      questionsCleared: store.correctIndices.length,
      sectionResult: {
        sectionId,
        correctAnswers: store.correctIndices.length,
      },
      learningStack: {
        date: new Date().toISOString().split('T')[0],
        totalClear: store.sectionClearCount,
      },
      questionResults,
    })
      .then(() => store.setSaveError(null))
      .catch((err) => {
        console.error('Error saving dashboard data:', err)
        store.setSaveError('学習記録の保存に失敗しました。')
      })
  }, [store.showResult])

  return store
}
