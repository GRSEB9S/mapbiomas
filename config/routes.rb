Rails.application.routes.draw do
  root 'map#index'

  get 'locales/set_language', to: 'locales#set_language', as: :set_language

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
  end
end
