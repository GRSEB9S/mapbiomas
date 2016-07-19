Rails.application.routes.draw do
  root 'high_voltage/pages#show', id: 'home'
  get '/map', to: 'map#index', as: :map
  get 'locales/set_language', to: 'locales#set_language', as: :set_language
  get '/download', to: 'downloads#download', as: :download, defaults: { format: :xlsx }

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
    resources :qualities, only: :index
  end
end
