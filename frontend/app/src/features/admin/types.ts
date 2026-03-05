export interface ChoiceAttributes {
  choice_text: string
  is_correct: boolean
}

export interface QuizFormData {
  question_text: string
  choices_attributes: ChoiceAttributes[]
  explanation_attributes: { explanation_text: string }
}
