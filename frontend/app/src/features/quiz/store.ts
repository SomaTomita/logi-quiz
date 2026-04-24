import { create } from 'zustand'
import type { Quiz, Choice } from './types'
import { shuffleArray } from '@/shared/utils/array'

export interface QuizSessionState {
  questions: Quiz[]
  currentIndex: number
  answerIndex: number | null
  isCorrect: boolean | null
  correctIndices: number[]
  userAnswers: (string | null)[]
  userChoiceIds: (number | null)[]
  showResult: boolean
  isStarted: boolean
  showTimer: boolean
  elapsedSeconds: number
  sectionClearCount: number
  saveError: string | null
  fetchError: string | null

  // Actions
  loadQuestions: (questions: Quiz[]) => void
  selectAnswer: (index: number, choice: Choice) => void
  nextQuestion: () => void
  handleTimeUp: () => void
  startQuiz: () => void
  reset: () => void
  tick: () => void
  setSaveError: (error: string | null) => void
  setFetchError: (error: string | null) => void

  // Derived getters
  currentQuestion: () => Quiz | null
  isLastQuestion: () => boolean
  correctAnswer: () => string
}

export const useQuizSessionStore = create<QuizSessionState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answerIndex: null,
  isCorrect: null,
  correctIndices: [],
  userAnswers: [],
  userChoiceIds: [],
  showResult: false,
  isStarted: false,
  showTimer: true,
  elapsedSeconds: 0,
  sectionClearCount: 0,
  saveError: null,
  fetchError: null,

  loadQuestions: (questions) =>
    set({
      questions: questions.map((q) => ({ ...q, choices: shuffleArray(q.choices) })),
      fetchError: null,
    }),

  selectAnswer: (index, choice) => {
    const correctAns = get().correctAnswer()
    set({
      answerIndex: index,
      isCorrect: choice.choiceText === correctAns,
    })
  },

  nextQuestion: () => {
    const {
      isCorrect,
      currentIndex,
      questions,
      correctIndices,
      sectionClearCount,
      answerIndex,
      userAnswers,
      userChoiceIds,
    } = get()

    const newCorrectIndices = isCorrect ? [...correctIndices, currentIndex] : correctIndices
    const currentQ = questions[currentIndex]
    const selectedText = answerIndex !== null ? currentQ.choices[answerIndex].choiceText : null
    const selectedChoiceId = answerIndex !== null ? currentQ.choices[answerIndex].id : null
    const newUserAnswers = [...userAnswers, selectedText]
    const newUserChoiceIds = [...userChoiceIds, selectedChoiceId]

    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        answerIndex: null,
        isCorrect: null,
        showTimer: false,
        correctIndices: newCorrectIndices,
        userAnswers: newUserAnswers,
        userChoiceIds: newUserChoiceIds,
      })
      // Re-enable timer after a tick
      setTimeout(() => set({ showTimer: true }))
    } else {
      set({
        showResult: true,
        currentIndex: 0,
        correctIndices: newCorrectIndices,
        userAnswers: newUserAnswers,
        userChoiceIds: newUserChoiceIds,
        sectionClearCount: sectionClearCount + 1,
        isStarted: false,
      })
    }
  },

  handleTimeUp: () => {
    set({ isCorrect: false })
    get().nextQuestion()
  },

  startQuiz: () =>
    set({
      currentIndex: 0,
      isStarted: true,
      showTimer: true,
      elapsedSeconds: 0,
    }),

  reset: () =>
    set({
      currentIndex: 0,
      answerIndex: null,
      isCorrect: null,
      correctIndices: [],
      userAnswers: [],
      userChoiceIds: [],
      showResult: false,
      isStarted: false,
      showTimer: false,
      elapsedSeconds: 0,
      sectionClearCount: 0,
      saveError: null,
      fetchError: null,
    }),

  setSaveError: (error) => set({ saveError: error }),
  setFetchError: (error) => set({ fetchError: error }),

  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),

  currentQuestion: () => {
    const { questions, currentIndex } = get()
    return questions[currentIndex] ?? null
  },

  isLastQuestion: () => {
    const { currentIndex, questions } = get()
    return currentIndex === questions.length - 1
  },

  correctAnswer: () => {
    const q = get().currentQuestion()
    return q?.choices.find((c) => c.isCorrect)?.choiceText ?? ''
  },
}))
