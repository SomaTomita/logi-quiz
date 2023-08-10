# ログイン状態確認用コントローラー
class Auth::SessionsController < ApplicationController
    # indexアクションでログイン状態を確認
    def index
        if current_user
            render json: {is_login: true, data: current_user }
        else
            render json: {is_login: false, message: "ユーザーが存在しません"}
        end
    end
  end