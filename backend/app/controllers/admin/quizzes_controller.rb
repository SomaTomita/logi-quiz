# 管理者用クイズCRUD API
class Admin::QuizzesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_question, only: [:show, :update, :destroy]

  # GET /admin/sections/:section_id/quizzes
  # セクション配下の全問題を選択肢・解説付きで一覧表示
  def index
    section = Section.find(params[:section_id])
    quizzes = section.questions.includes(:choices, :explanation)
    render json: quizzes, include: [:choices, :explanation], status: :ok
  end

  # POST /admin/sections/:section_id/quizzes
  # 問題を選択肢・解説のネスト属性と共に一括作成
  def create
    section = Section.find(params[:section_id])
    @question = section.questions.new(question_params)

    if @question.save
      render json: @question, include: [:choices, :explanation], status: :created
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # GET /admin/sections/:section_id/quizzes/:id
  # 問題の詳細を選択肢・解説付きで返却（set_questionでeager load済み）
  def show
    render json: @question, include: [:choices, :explanation], status: :ok
  end

  # PATCH /admin/sections/:section_id/quizzes/:id
  # 問題・選択肢・解説をネスト属性で一括更新
  def update
    if @question.update(question_params)
      render json: @question, include: [:choices, :explanation]
    else
      render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /admin/sections/:section_id/quizzes/:id
  def destroy
    @question.destroy!
    head :no_content
  end

  private

  # eager loadで選択肢・解説を事前読み込み（show/update/destroyで使用）
  def set_question
    @question = Question.includes(:choices, :explanation).find(params[:id])
  end

  # ネスト属性: idと_destroyを許可し、既存レコードの更新・削除に対応
  def question_params
    params.require(:quiz).permit(
      :question_text,
      choices_attributes: [:id, :choice_text, :is_correct, :_destroy],
      explanation_attributes: [:id, :explanation_text, :_destroy]
    )
  end
end
