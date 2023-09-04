class Admin::QuizzesController < ApplicationController
    before_action :ensure_admin 
    before_action :set_question, only: [:show, :update, :destroy]

    # クイズの一覧表示アクション
    def index
        if params[:section_id]
            # section_idに基づいてセクション、関連付けられているすべてのクイズを取得し、JSON形式で返す
            section = Section.find(params[:section_id])
            quizzes = section.questions
            render json: quizzes, status: :ok
        else
            render json: { error: "Section ID is required" }, status: :bad_request
        end
    end

    def create
        section = Section.find(params[:section_id])
        # 新しいクイズを上で特定したセクションに関連付けて作成
        @question = section.questions.new(question_params)
        # Question モデルは has_one :explanation の関連付けであるので、build_explanationで、questionに紐づいた新しい Explanation オブジェクトをビルド
        explanation = @question.build_explanation(explanation_text: params[:quiz][:explanation_text]) # paramsでquizにあるexplanation_textを取得
      
        if @question.save
          render json: @question, status: :created
        else
          render json: { errors: @question.errors.full_messages + explanation.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def show
        @question = Question.includes(:choices, :explanation).find(params[:id])
        # クイズの詳細と関連するchoicesとexplanationをJSON形式で返す
        render json: @question, include: [:choices, :explanation], status: :ok
    end
      
    def update
        if @question.update(question_params)
            # クイズが正常に更新された場合、更新されたクイズの詳細をJSON形式で返す
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
        params.require(:quiz).permit( #データのオブジェクト名はquiz
            :question_text, 
            # debugの@question.inspectで調査し、update時に選択肢と解説が更新できない状態だったが、下記を追加し可能に
            choices_attributes: [:id, :choice_text, :is_correct, :_destroy],
            explanation_attributes: [:id, :explanation_text, :_destroy]
          )
    end 
end
