class ApplicationController < ActionController::API
   # DeviseTokenAuthの機能を追加
   include DeviseTokenAuth::Concerns::SetUserByToken

   def ensure_admin
      Rails.logger.info "Current User: #{current_user.inspect}"
      Rails.logger.info "Is Admin?: #{current_user&.admin?}"

      unless current_user&.admin?
        render json: { error: "You're not authorized to access this page." }, status: 403
      end
    end
end
