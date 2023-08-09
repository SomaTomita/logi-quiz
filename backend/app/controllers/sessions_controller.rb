class SessionsController < ApplicationController
  # createアクションの時だけ、authenticate_requestをスキップ
  skip_before_action :authenticate_request, only: [:create]

  def create
    user = User.find_by(email: params[:email])

    if user && user.authenticate(params[:password])
      # 署名アルゴリズムをRS256に変更
      rsa_private = OpenSSL::PKey::RSA.new(Rails.application.secrets.rsa_private)
      payload = {
        user_id: user.id,
        iss: 'your_app_name',          # 発行者を定義
        aud: 'your_app_client_name',   # 受信者を定義
        exp: Time.now.to_i + 1.hour    # JWTの有効期限を1時間に設定
      }
      token = JWT.encode payload, rsa_private, 'RS256'

      # JWTをhttpOnly Cookieに保存
      # セッション認証ではJWTは使わないので、レスポンスのJSONには含めない
      cookies.signed[:jwt] = { value: token, httponly: true }

      render json: { status: 'SUCCESS', message: 'Logged in successfully' }
    else
      render json: { status: 'ERROR', message: 'Email or password is incorrect' }
    end
  end
end
