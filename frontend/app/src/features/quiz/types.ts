export interface Choice {
  id: number
  choiceText: string
  isCorrect: boolean
}

export interface Explanation {
  id?: number
  explanationText: string
}

export interface Quiz {
  id: number
  questionText: string
  choices: Choice[]
  explanation: Explanation
}
