class UsersController < ApplicationController
    def create
      # 'user_params' メソッドで得られるパラメータを使用して新しいユーザーを初期化
      user = User.new(user_params)

      if user.save
        # 保存が成功した場合、状態とともに新しいユーザーのデータをJSON形式で返す
        render json: { status: 'SUCCESS', message: 'Loaded the user', data: user }
      else
        # 保存が失敗した場合、状態とエラーメッセージをJSON形式で返す
        render json: { status: 'ERROR', message: 'User not saved', data: user.errors }
      end
    end
  
    private
  
    # ユーザーが送信できるパラメータを制御
    def user_params
      params.require(:user).permit(:name, :email, :password)
    end
  end
  