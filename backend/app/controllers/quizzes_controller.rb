class QuizzesController < ApplicationController
  def index
    section = Section.find(params[:section_id])
    quizzes = section.questions.order("RAND()").limit(10)

    render json: quizzes.to_json(only: [:question_text], include: { choices: { only: [:choice_text, :is_correct] } })
  end
end
