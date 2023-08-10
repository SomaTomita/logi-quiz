# ログイン状態確認用コントローラー
class Api::V1::Auth::SessionsController < ApplicationController
    # indexアクションでログイン状態を確認
    def index
      # current_api_v1_userはログイン中のユーザー情報を取得するメソッド
      if current_api_v1_user
        render json: { is_login: true, data: current_api_v1_user }
      else
        render json: { is_login: false, message: "ユーザーが存在しません" }
      end
    end
  end