Rails.application.routes.draw do
  # ヘルスチェック（ALB/ECS用）
  get '/health', to: proc { [200, {}, ['OK']] }

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

  # 公開エンドポイント: セクション一覧とクイズ取得のみ（CRUDはadmin namespaceで管理）
  resources :sections, only: %i[index] do
    resources :quizzes, only: %i[index]
  end

  # ダッシュボードのデータ取得
  resources :dashboard, only: [] do
    member do # こちらのブロックの使用により、URLは特定のユーザーのIDを持つ形に
      get :dashboard_data
      post :section_cleared
    end
  end
end