# アカウント作成用コントローラー
# 将来的なバージョンアップ（例:V2）をスムーズにできる
class Api::V1::Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  private

    # サインアップ時に許可するパラメーター
    def sign_up_params
      params.permit(:email, :password, :password_confirmation, :name)
    end
end