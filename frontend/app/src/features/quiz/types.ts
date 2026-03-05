export interface Choice {
  id: number
  choice_text: string
  is_correct: boolean
}

export interface Explanation {
  id?: number
  explanation_text: string
}

export interface Quiz {
  id: number
  question_text: string
  choices: Choice[]
  explanation: Explanation
}
