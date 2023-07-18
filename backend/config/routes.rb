Rails.application.routes.draw do
  get '/sections', to: 'sections#index'
  
  get '/sections/:section_id/quizzes', to: 'quizzes#index', as: 'section_quizzes'

end
