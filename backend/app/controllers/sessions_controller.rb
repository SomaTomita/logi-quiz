class SessionsController < ApplicationController
    def create
      user = User.find_by(email: params[:email])
  
      if user && user.authenticate(params[:password])
        render json: { status: 'SUCCESS', message: 'Logged in successfully', data: user }
      else
        render json: { status: 'ERROR', message: 'Email or password is incorrect' }
      end
    end
end
