# クイズ出題API
class QuizzesController < ApplicationController
  # GET /sections/:section_id/quizzes
  # 指定セクションからランダムに10問を選択肢・解説付きで返却
  # IDのみを先にsampleし、当選した10問だけをeager loadする（全件ロード回避）
  def index
    section = Section.find(params[:section_id])
    question_ids = section.questions.pluck(:id).sample(10)
    quizzes = Question.where(id: question_ids)
                      .includes(:choices, :explanation)

    render json: quizzes.as_json(
      only: [:id, :question_text],
      include: {
        choices: { only: [:id, :choice_text, :is_correct] },
        explanation: { only: [:explanation_text] }
      }
    )
  end
end