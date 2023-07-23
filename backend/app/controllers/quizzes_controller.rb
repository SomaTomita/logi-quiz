class QuizzesController < ApplicationController

  def index
    section = Section.find(params[:section_id])
    quizzes = section.quizzes.order("RAND()").limit(10) # section.quizzesに変更

    render json: quizzes.to_json(only: [:question_text], include: { choices: { only: [:choice_text, :is_correct] } })
  end

  def create
    section = Section.find(params[:section_id])
    question = section.questions.new(question_params)
    explanation = question.build_explanation(explanation_text: params[:quiz][:explanation_text])
  
    if question.save
      render json: question, status: :created
    else
      render json: { errors: question.errors.full_messages + explanation.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  private

  def question_params
    params.require(:quiz).permit(:question_text, choices_attributes: [:choice_text, :is_correct])
  end 
end
