# ダッシュボード関連のAPI
# ビジネスロジックはUserモデルに委譲（Fat Controller防止）
class DashboardController < ApplicationController
  before_action :authenticate_user!

  # GET /dashboard/dashboard_data
  # ユーザーのダッシュボードデータ（進捗・学習ログ）を返却
  def dashboard_data
    render json: { data: current_user.dashboard_data }
  end

  # POST /dashboard/section_cleared
  # セクションクリア時の一連の更新処理をUserモデルに委譲
  def section_cleared
    section = Section.find(params[:section_id])

    current_user.record_section_cleared!(
      section: section,
      play_time: params[:play_time].to_i,
      questions_cleared: params[:questions_cleared].to_i,
      correct_answers: params[:correct_answers].to_i,
      total_clear: params[:total_clear].to_i
    )

    if params[:question_results].present?
      SrsService.record_batch!(user: current_user, question_results: params[:question_results])
    end

    head :ok
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end