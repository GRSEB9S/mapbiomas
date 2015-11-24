Rails.application.routes.draw do
  root 'map#index'

  get 'pages/methodology', to: 'pages#methodology', as: 'pages_methodology'

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
  end
end
