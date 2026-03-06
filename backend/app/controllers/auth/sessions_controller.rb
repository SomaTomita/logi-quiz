# ログイン状態確認API
# セキュリティ: encrypted_password, tokens, confirmation_token等の機密フィールドを除外し、
# フロントエンドが必要とするフィールドのみをホワイトリストで返却
class Auth::SessionsController < ApplicationController
  # フロントエンドのUser型に合わせた安全なフィールド一覧
  SAFE_USER_FIELDS = %i[
    id uid provider email name nickname image admin
    allow_password_change total_play_time total_questions_cleared
    created_at updated_at
  ].freeze

  # GET /auth/sessions
  # ログイン済みならユーザー情報を返却、未ログインならis_login: falseを返却
  def index
    if current_user
      render json: { is_login: true, data: current_user.as_json(only: SAFE_USER_FIELDS) }
    else
      render json: { is_login: false, message: "ユーザーが存在しません" }
    end
  end
end