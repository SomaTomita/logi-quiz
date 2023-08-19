class QuizzesController < ApplicationController
  def index
    section = Section.find(params[:section_id])
    # Question は Section モデルに属しており(belongs_to :section)、Section モデルは多数の Question モデル(has_many :questions)の関係
    quizzes = section.questions.order("RAND()").limit(10) 

    render json: quizzes.to_json(
      only: [:question_text],
      include: { # オブジェクトのシリアル化により関連データを一度のレスポンスでクライアントへ送信可
        choices: { only: [:choice_text, :is_correct] },
        explanation: { only: [:explanation_text] }
      }
    )
  end

  private

  def question_params
    params.require(:quiz).permit(:question_text, choices_attributes: [:choice_text, :is_correct]) #データのオブジェクト名はquiz
  end 
end