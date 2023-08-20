class Admin::QuizzesController < ApplicationController
    before_action :ensure_admin
    before_action :set_question, only: [:show, :update, :destroy]

    def index
        if params[:section_id]
            section = Section.find(params[:section_id])
            quizzes = section.questions # セクションに関連付けられているすべてのクイズを取得する
            render json: quizzes, status: :ok
        else
            render json: { error: "Section ID is required" }, status: :bad_request
        end
    end

    def create
        section = Section.find(params[:section_id])
        @question = section.questions.new(question_params)
        # Question モデルは has_one :explanation の関連付けであるので、build_explanationで、questionに紐づいた新しい Explanation オブジェクトをビルド
        explanation = @question.build_explanation(explanation_text: params[:quiz][:explanation_text]) # pramsでquizにあるexplanation_textを取得
      
        if @question.save
          render json: @question, status: :created
        else
          render json: { errors: @question.errors.full_messages + explanation.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def show
        @question = Question.includes(:choices, :explanation).find(params[:id])
        render json: @question, include: [:choices, :explanation], status: :ok
    end
      

    def update
        if @question.update(question_params)
            @question = Question.includes(:choices, :explanation).find(@question.id)
            render json: @question
        else
            render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def destroy
        @question.destroy
        render json: { message: "Question deleted successfully" }, status: :ok
    end

    private

    def set_question
        @question = Question.find(params[:id])
    end

    def question_params
        params.require(:quiz).permit(:question_text, choices_attributes: [:choice_text, :is_correct]) #データのオブジェクト名はquiz
    end 
end
