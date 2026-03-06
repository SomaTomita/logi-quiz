# 管理者用セクションCRUD API
class Admin::SectionsController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin
  before_action :set_section, only: [:update, :destroy]

  # POST /admin/sections
  def create
    @section = Section.new(section_params)

    if @section.save
      render json: @section, status: :created
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # PATCH /admin/sections/:id
  def update
    if @section.update(section_params)
      render json: @section
    else
      render json: @section.errors, status: :unprocessable_entity
    end
  end

  # DELETE /admin/sections/:id
  # dependent: :destroyにより関連する問題・選択肢・解説も連動削除
  def destroy
    @section.destroy!
    head :no_content
  end

  private

  def set_section
    @section = Section.find(params[:id])
  end

  def section_params
    params.require(:section).permit(:section_name)
  end
end
