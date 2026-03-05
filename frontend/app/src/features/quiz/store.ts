import { create } from 'zustand'
import type { Quiz, Choice } from './types'

export interface QuizSessionState {
  questions: Quiz[]
  currentIndex: number
  answerIndex: number | null
  isCorrect: boolean | null
  correctIndices: number[]
  showResult: boolean
  isStarted: boolean
  showTimer: boolean
  elapsedSeconds: number
  sectionClearCount: number

  // Actions
  loadQuestions: (questions: Quiz[]) => void
  selectAnswer: (index: number, choice: Choice) => void
  nextQuestion: () => void
  handleTimeUp: () => void
  startQuiz: () => void
  reset: () => void
  tick: () => void

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
  showResult: false,
  isStarted: false,
  showTimer: true,
  elapsedSeconds: 0,
  sectionClearCount: 0,

  loadQuestions: (questions) => set({ questions }),

  selectAnswer: (index, choice) => {
    const correctAns = get().correctAnswer()
    set({
      answerIndex: index,
      isCorrect: choice.choice_text === correctAns,
    })
  },

  nextQuestion: () => {
    const { isCorrect, currentIndex, questions, correctIndices, sectionClearCount } = get()

    const newCorrectIndices = isCorrect ? [...correctIndices, currentIndex] : correctIndices

    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        answerIndex: null,
        isCorrect: null,
        showTimer: false,
        correctIndices: newCorrectIndices,
      })
      // Re-enable timer after a tick
      setTimeout(() => set({ showTimer: true }))
    } else {
      set({
        showResult: true,
        currentIndex: 0,
        correctIndices: newCorrectIndices,
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
      showResult: false,
      isStarted: false,
      showTimer: false,
      elapsedSeconds: 0,
      sectionClearCount: 0,
    }),

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
    return q?.choices.find((c) => c.is_correct)?.choice_text ?? ''
  },
}))
