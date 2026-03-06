# クイズ出題API
class QuizzesController < ApplicationController
  # GET /sections/:section_id/quizzes
  # 指定セクションからランダムに10問を選択肢・解説付きで返却
  # includes: N+1クエリ防止、sample: DB非依存のランダム選択
  def index
    section = Section.find(params[:section_id])
    quizzes = section.questions
                     .includes(:choices, :explanation)
                     .to_a
                     .sample(10)

    render json: quizzes.as_json(
      only: [:question_text],
      include: {
        choices: { only: [:choice_text, :is_correct] },
        explanation: { only: [:explanation_text] }
      }
    )
  end
end