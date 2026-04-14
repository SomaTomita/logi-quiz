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

    # BI分析ダッシュボード（管理者専用）
    scope :analytics, as: :analytics do
      get :overview,         to: 'analytics#overview'
      get :topic_accuracy,   to: 'analytics#topic_accuracy'
      get :engagement,       to: 'analytics#engagement'
      get :response_times,   to: 'analytics#response_times'
      get :retention_curves, to: 'analytics#retention_curves'
      get :learner_segments, to: 'analytics#learner_segments'
    end
  end

  # 公開エンドポイント: セクション一覧とクイズ取得のみ（CRUDはadmin namespaceで管理）
  resources :sections, only: %i[index] do
    resources :quizzes, only: %i[index]
  end

  # ダッシュボードのデータ取得（認証トークンからユーザーを特定するためIDは不要）
  scope :dashboard do
    get :dashboard_data, to: 'dashboard#dashboard_data'
    post :section_cleared, to: 'dashboard#section_cleared'
  end

  # 復習キューAPI（SRSスケジュールベース）
  scope :reviews do
    get '/', to: 'reviews#index'
    post :complete, to: 'reviews#complete'
  end
end