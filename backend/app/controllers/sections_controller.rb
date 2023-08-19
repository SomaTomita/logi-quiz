class SectionsController < ApplicationController
  def index
    sections = Section.all
    render json: sections.to_json(only: [:id, :section_name]) # すべてのセクションを取得
  end

  private

  def section_params
    params.require(:section).permit(:section_name)
  end
end