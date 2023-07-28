Rails.application.routes.draw do
  get '/sections', to: 'sections#index'

  resources :sections do
    resources :quizzes, only: [:index, :create]
  end
end