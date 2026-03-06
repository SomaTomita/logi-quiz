# セクション一覧API（公開エンドポイント）
class SectionsController < ApplicationController
  # GET /sections
  # 全セクションのID・名前のみを返却（不要カラムは除外）
  def index
    sections = Section.all
    render json: sections.as_json(only: [:id, :section_name])
  end
end