class ApplicationController < ActionController::API
    # 全てのアクションが実行される前に、authenticate_requestを実行する
  before_action :authenticate_request

  private

  def authenticate_request
    # リクエストヘッダからAuthorizationトークンを取得し、最後の部分をトークンとして取得
    token = request.headers['Authorization']&.split(' ')&.last
    # もしトークンが存在しなければ、エラーメッセージを返す
    return render json: { status: 'ERROR', message: 'Token is missing' }, status: :unauthorized if token.nil?

    # JWTのデコードにはアプリケーションの秘密鍵とHS256アルゴリズムを使用
    decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
    # デコードしたトークンからユーザーIDを取得し、そのユーザーを@current_userとして設定
    @current_user = User.find(decoded_token[0]["user_id"])
  # もしJWTのデコードに失敗したら、エラーメッセージを返す
  rescue JWT::DecodeError
    render json: { status: 'ERROR', message: 'Token is invalid' }, status: :unauthorized
  end
end