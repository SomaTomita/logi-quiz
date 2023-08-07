Rails.application.routes.draw do
  # 既存のユーザーがログインするためのルーティング
  post '/signin', to: 'sessions#create'

  # POSTリクエストを/users URLに送ると、Usersコントローラのcreateアクションが呼び出され
  resources :users, only: [:create]
  
  # /sections URLに送ると、Sectionsコントローラのindexアクションが呼び出される
  get '/sections', to: 'sections#index'

  # /sections/:section_id/quizzes URLにGETまたはPOSTリクエストを送ると、Quizzesコントローラのindexまたはcreateアクションが呼び出される
  resources :sections do
    resources :quizzes, only: [:index, :create]
  end
end
