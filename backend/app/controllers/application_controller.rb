class ApplicationController < ActionController::API
   # DeviseTokenAuthの機能を追加
   include DeviseTokenAuth::Concerns::SetUserByToken
end
