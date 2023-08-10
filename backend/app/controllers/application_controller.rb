class ApplicationController < ActionController::API
   # DeviseTokenAuthの機能を追加
  include DeviseTokenAuth::Concerns::SetUserByToken

  # フロントをTypescriptで書くためCSRF対策をスキップ
  skip_before_action :verify_authenticity_token
  
  helper_method :current_user, :user_signed_in?
end
