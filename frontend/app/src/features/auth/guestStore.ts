import { create } from 'zustand'

const FREE_QUIZ_LIMIT = 3
const STORAGE_KEY = 'logi_quiz_guest_count'

const getStoredCount = (): number => {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0
  } catch {
    return 0
  }
}

interface GuestState {
  quizCompletionCount: number
  showLoginPrompt: boolean
  canPlayQuiz: () => boolean
  incrementCompletionCount: () => void
  dismissLoginPrompt: () => void
}

export const useGuestStore = create<GuestState>((set, get) => ({
  quizCompletionCount: getStoredCount(),
  showLoginPrompt: false,

  canPlayQuiz: () => get().quizCompletionCount < FREE_QUIZ_LIMIT,

  incrementCompletionCount: () => {
    const newCount = get().quizCompletionCount + 1
    try {
      localStorage.setItem(STORAGE_KEY, String(newCount))
    } catch {
      // localStorage unavailable
    }
    set({
      quizCompletionCount: newCount,
      showLoginPrompt: newCount >= FREE_QUIZ_LIMIT,
    })
  },

  dismissLoginPrompt: () => set({ showLoginPrompt: false }),
}))

export { FREE_QUIZ_LIMIT }
