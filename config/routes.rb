Rails.application.routes.draw do
  root 'high_voltage/pages#show', id: 'home'

  devise_for :users

  get '/map', to: 'map#index', as: :map
  get 'locales/set_language', to: 'locales#set_language', as: :set_language
  get '/download/transitions',
      to: 'downloads#transitions',
      as: :download_transitions, defaults: { format: :xlsx }
  get '/download/statistics',
      to: 'downloads#statistics',
      as: :download_statistics, defaults: { format: :xlsx }
  get '/stats', to: 'stats#show', as: :stats
  get '/views', to: 'views#index', as: :views

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
    resources :qualities, only: :index
  end
end
