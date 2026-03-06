# ユーザー登録API（DeviseTokenAuthのRegistrationsControllerを拡張）
# POST /auth でユーザー登録を実行
class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  # パラメータのネスト不要（フロントエンドからフラットなJSONで送信）
  wrap_parameters false

  private

  # 登録時に許可するパラメータをホワイトリストで制限
  # confirm_success_urlはDeviseTokenAuthがparams[:confirm_success_url]から直接取得するため
  # sign_up_paramsには含めない（含めるとActiveRecordが未知カラムとしてエラーになる）
  def sign_up_params
    params.permit(:name, :email, :password, :password_confirmation)
  end
end
