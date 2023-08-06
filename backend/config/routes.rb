Rails.application.routes.draw do

  # POSTリクエストを/users URLに送ると、Usersコントローラのcreateアクションが呼び出され
  resources :users, only: [:create]
  
  # /sections URLに送ると、Sectionsコントローラのindexアクションが呼び出される
  get '/sections', to: 'sections#index'
  # POSTリクエストを/login-create URLに送ると、Sessionsコントローラのcreateアクションが呼び出される
  post '/login-create', to: 'sessions#create'

  # /sections/:section_id/quizzes URLにGETまたはPOSTリクエストを送ると、Quizzesコントローラのindexまたはcreateアクションが呼び出される
  resources :sections do
    resources :quizzes, only: [:index, :create]
  end
end