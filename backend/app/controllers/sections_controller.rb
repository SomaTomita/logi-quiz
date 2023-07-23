class SectionsController < ApplicationController
  def index
    sections = Section.all
    render json: sections.to_json(only: [:id, :section_name])
  end

  def create
    section = Section.new(section_params)
    
    if section.save
      render json: section, status: :created
    else
      render json: section.errors, status: :unprocessable_entity
    end
  end

  private

  def section_params
    params.require(:section).permit(:section_name)
  end
end