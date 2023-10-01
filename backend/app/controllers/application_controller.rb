class ApplicationController < ActionController::API
   include DeviseTokenAuth::Concerns::SetUserByToken

   def ensure_admin
      unless current_user&.admin?
        render json: { error: "You're not authorized to access this page." }, status: 403
      end
    end
end
