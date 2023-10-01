class Admin::QuizzesController < ApplicationController
    before_action :ensure_admin 
    before_action :set_question, only: [:show, :update, :destroy]

    # セクション別に紐づいたクイズの一覧表示アクション
    def index
        if params[:section_id]
            section = Section.find(params[:section_id])
            quizzes = section.questions
            render json: quizzes, status: :ok
        else
            render json: { error: "Section ID is required" }, status: :bad_request
        end
    end

    def create
        section = Section.find(params[:section_id])
        @question = section.questions.new(question_params)
      
        if @question.save
          render json: @question, status: :created
        else
          render json: { errors: @question.errors.full_messages + explanation.errors.full_messages }, status: :unprocessable_entity
        end
    end

    # 特定のクイズの詳細情報を取得するアクション
    def show
        @question = Question.includes(:choices, :explanation).find(params[:id])
        render json: @question, include: [:choices, :explanation], status: :ok
    end
      
    def update
        if @question.update(question_params)
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
        params.require(:quiz).permit(
            :question_text, 
            # debugの@question.inspectで調査し、update時に選択肢と解説が更新できない状態だったが、下記attributesを追加し可能に
            choices_attributes: [:id, :choice_text, :is_correct, :_destroy],
            explanation_attributes: [:id, :explanation_text, :_destroy]
          )
    end 
end
