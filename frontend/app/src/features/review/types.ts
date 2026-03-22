export interface ReviewChoice {
  id: number
  choiceText: string
  isCorrect: boolean
}

export interface ReviewQuestion {
  id: number
  questionText: string
  choices: ReviewChoice[]
  explanation: { explanationText: string }
  boxLevel: number
  attemptCount: number
  correctCount: number
}

export interface ReviewIndexResponse {
  reviewQuestions: ReviewQuestion[]
  totalDue: number
}

export interface ReviewCompleteResult {
  questionId: number
  boxLevel: number
  nextReviewAt: string
}

export interface ReviewCompleteResponse {
  results: ReviewCompleteResult[]
}
