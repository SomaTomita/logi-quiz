export interface ClearedSection {
  sectionName: string
  correctAnswers: number
  clearedAt: string
}

export interface StudyLog {
  date: string
  studyTime: number
}

export interface DashboardData {
  totalPlayTime: number
  totalQuestionsCleared: number
  clearedSections: ClearedSection[]
  studyLogsPastYear: StudyLog[]
}

export interface QuestionResult {
  questionId: number
  choiceId: number | null
  correct: boolean
}

export interface DashboardSaveData {
  playTime?: number
  questionsCleared?: number
  sectionResult?: {
    sectionId: string | number
    correctAnswers: number
  }
  learningStack?: {
    date: string
    totalClear: number
  }
  questionResults?: QuestionResult[]
}
