class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  wrap_parameters false # registration キーの下にネストされた情報を送信せずにユーザーを登録

  private

  def sign_up_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
