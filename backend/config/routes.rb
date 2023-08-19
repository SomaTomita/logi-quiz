Rails.application.routes.draw do
  # ログイン機能のルーティング
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations: 'auth/registrations'
  }

  # ログインユーザー取得のルーティング
  namespace :auth do
    resources :sessions, only: %i[index]
  end

  # adminユーザーのルーティング
  namespace :admin do
    resources :sections, only: %i[create update destroy] do
      resources :quizzes, only: %i[create update destroy]
    end
  end

  # /sections/:section_id/quizzes URLにGETまたはPOSTリクエストを送ると、Quizzesコントローラのindexまたはcreateアクションが呼び出される
  resources :sections do
    resources :quizzes, only: %i[index create]
  end
end