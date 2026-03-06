# 全コントローラの基底クラス（API専用モード）
class ApplicationController < ActionController::API
  # DeviseTokenAuth: リクエストヘッダーからトークンを検証しcurrent_userを設定
  include DeviseTokenAuth::Concerns::SetUserByToken

  private

  # 管理者権限チェック（admin namespaceのコントローラで使用）
  # before_actionとして設定し、非管理者のアクセスを403で拒否
  def ensure_admin
    unless current_user&.admin?
      render json: { error: "You're not authorized to access this page." }, status: :forbidden
    end
  end
end
