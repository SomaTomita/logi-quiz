# セクション一覧API（公開エンドポイント）
class SectionsController < ApplicationController
  # GET /sections
  # 全セクションのID・名前のみを返却（不要カラムは除外）
  def index
    locale = params[:locale].presence || "ja"
    sections = Section.by_locale(locale).order(:id)
    render json: sections.as_json(only: [:id, :section_name])
  end
end