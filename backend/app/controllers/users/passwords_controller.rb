class Users::PasswordsController < Devise::PasswordsController
    respond_to :json

    def set_flash_message!(*)
    end
  
    private
  
    #Userとオプションを受け取り、適切なレスポンスを返す
    def respond_with(resource, _opts = {})

      send_reset_mail_success && return unless resource.present?
      # DBに保存されている場合パスワードリセットの成功を示すメソッドを呼ぶ
      reset_password_success && return if resource.persisted?
  
      # 上記の条件のいずれも満たさない場合、パスワードリセット失敗を示すメソッドを呼ぶ
      reset_password_failed
    end
  
    def send_reset_mail_success
      render json: { message: 'Send Reset Mail successfully.' }
    end
  
    def reset_password_success
      render json: { message: 'Password Reset successfully.' }
    end
  
    def reset_password_failed
      render json: { message: "Something went wrong." }
    end
end