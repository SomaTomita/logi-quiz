Rails.application.routes.draw do
  # 名前空間で、URLやコントローラーの階層を整理
  namespace :api do
    namespace :v1 do
      # テスト用のルーティング
      resources :test, only: %i[index]

      # 認証を扱うモデル, at: ルーティングのエンドポイントの接頭辞, コントローラーを指定
      mount_devise_token_auth_for 'User', at: 'auth', controllers: {
        registrations: 'api/v1/auth/registrations'
      }

      namespace :auth do
        resources :sessions, only: %i[index]
      end
    end
  end
end

  # /sections URLに送ると、Sectionsコントローラのindexアクションが呼び出される
  get '/sections', to: 'sections#index'

  # /sections/:section_id/quizzes URLにGETまたはPOSTリクエストを送ると、Quizzesコントローラのindexまたはcreateアクションが呼び出される
  resources :sections do
    resources :quizzes, only: [:index, :create]
  end
end
