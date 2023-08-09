class ApplicationController < ActionController::API
  # 全てのアクションが実行される前に、authenticate_requestを実行する
  before_action :authenticate_request

  private

  def authenticate_request
    # httpOnly CookieからJWTを取得
    token = cookies.signed[:jwt]

    # もしトークンが存在しなければ、エラーメッセージを返す
    return render json: { status: 'ERROR', message: 'Token is missing' }, status: :unauthorized if token.nil?

    # JWTのデコードにはアプリケーションの秘密鍵とRS256アルゴリズムを使用
    rsa_public = OpenSSL::PKey::RSA.new(Rails.application.secrets.rsa_public)
    decoded_token = JWT.decode(token, rsa_public, true, { algorithm: 'RS256' })

    # デコードしたトークンからユーザーIDを取得し、そのユーザーを@current_userとして設定
    @current_user = User.find(decoded_token[0]["user_id"])

  # もしJWTのデコードに失敗したら、エラーメッセージを返す
  rescue JWT::DecodeError
    render json: { status: 'ERROR', message: 'Token is invalid' }, status: :unauthorized
  end
end
