class SessionsController < ApplicationController
    # createアクションの時だけ、authenticate_requestをスキップ
    skip_before_action :authenticate_request, only: [:create]

    def create
      user = User.find_by(email: params[:email])
  
      if user && user.authenticate(params[:password])
        token = JWT.encode({ user_id: user.id }, Rails.application.secrets.secret_key_base, 'HS256')
        render json: { status: 'SUCCESS', message: 'Logged in successfully', token: token }
      else
        render json: { status: 'ERROR', message: 'Email or password is incorrect' }
      end
    end
end
