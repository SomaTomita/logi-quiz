export interface ChoiceAttributes {
  choiceText: string
  isCorrect: boolean
}

export interface QuizFormData {
  questionText: string
  choicesAttributes: ChoiceAttributes[]
  explanationAttributes: { explanationText: string }
}
