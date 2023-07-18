class SectionsController < ApplicationController
  def index
    sections = Section.all
    render json: sections.to_json(only: [:id, :section_name])
  end
end
