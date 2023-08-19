class Admin::SectionsController < ApplicationController
    before_action :ensure_admin
    before_action :set_section, only: [:update, :destroy]

    def create
        @section = Section.new(section_params)
        
        if @section.save
          render json: @section, status: :created
        else
          render json: @section.errors, status: :unprocessable_entity
        end
      end
    

    def update
        if @section.update(section_params)
            render json: @section
        else
            render json: @section.errors, status: :unprocessable_entity
        end
    end

    def destroy
        @section.destroy
        render json: { message: "Section deleted successfully" }, status: :ok
    end

    private

    def set_section
        @section = Section.find(params[:id])
    end

    def section_params
        params.require(:section).permit(:section_name)
      end

end
