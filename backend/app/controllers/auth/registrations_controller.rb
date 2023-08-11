# アカウント作成用コントローラー
class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  wrap_parameters false 

  # コールバックを追加
  after_action :log_errors, only: [:create], if: -> { response.status == 500 }

  private

  def sign_up_params
    params.permit(:name, :email, :password, :password_confirmation)
  end

  # エラーログ出力用のメソッドを追加
  def log_errors
    Rails.logger.info "User creation failed: #{resource.errors.full_messages.join(', ')}" if resource.errors.any?
  end
end
