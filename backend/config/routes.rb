Rails.application.routes.draw do
  # ログイン機能のルーティング
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    registrations: 'auth/registrations',
    passwords: 'users/passwords'
  }

  # ログインユーザー取得のルーティング
  namespace :auth do
    resources :sessions, only: %i[index]
  end

  # adminユーザーのルーティング
  namespace :admin do
    resources :sections, only: %i[create update destroy] do
      resources :quizzes, only: %i[index show create update destroy]
    end
  end

  # セクションの標準的な7つのアクション及び特定のセクションに関連するクイズ操作のルーティング
  resources :sections do
    resources :quizzes, only: %i[index create]
  end

  # ダッシュボードのデータ取得
  resources :dashboard, only: [] do
    member do # こちらのブロックの使用により、URLは特定のユーザーのIDを持つ形に
      get :dashboard_data
      post :section_cleared
    end
  end
end