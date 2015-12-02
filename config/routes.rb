Rails.application.routes.draw do
  root 'high_voltage/pages#show', id: 'home'
  get '/map', to: 'map#index', as: :map
  get 'locales/set_language', to: 'locales#set_language', as: :set_language

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
  end
end
