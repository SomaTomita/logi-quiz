export interface ClearedSection {
  section_name: string
  correct_answers: number
  cleared_at: string
}

export interface StudyLog {
  date: string
  study_time: number
}

export interface DashboardData {
  total_play_time: number
  total_questions_cleared: number
  cleared_sections: ClearedSection[]
  study_logs_past_year: StudyLog[]
}

export interface DashboardSaveData {
  playTime?: number
  questions_cleared?: number
  sectionResult?: {
    sectionId: string | number
    correctAnswers: number
  }
  learningStack?: {
    date: string
    totalClear: number
  }
}
