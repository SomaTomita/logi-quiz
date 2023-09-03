class Auth::SessionsController < ApplicationController
    # indexアクションでログイン状態を確認
    def index
        # ユーザーがログインしている場合、current_userはユーザーのデータベースに保存されている情報が格納されているオブジェクトを返し、
        # ログインしていなければnilを返す
        if current_user
            render json: {is_login: true, data: current_user }
        else
            render json: {is_login: false, message: "ユーザーが存在しません"}
        end
    end
  end