# アカウント作成用コントローラー
class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

  def sign_up_params
    # サインアップ時に登録できるカラムを指定
    params.require(:registration).permit(:email, :password, :password_confirmation)
  end
end