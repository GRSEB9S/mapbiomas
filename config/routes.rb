Rails.application.routes.draw do
  root 'high_voltage/pages#show', id: 'home'

  devise_for :users

  get '/map', to: 'map#index', as: :map
  get '/my_maps', to: 'map#my_maps', as: :my_maps
  get '/iframe/:id', to: 'map#iframe', as: :iframe

  get 'profile', to: 'users#profile', as: :user_profile
  patch '/users/:id', to: 'users#update', as: :update_user
  get 'registered', to: 'users#registered', as: :registered_users

  post '/map', to: 'map#create', as: :create_map
  patch '/map/:id', to: 'map#update', as: :update_map
  delete '/map/:id', to: 'map#destroy', as: :delete_map

  get 'locales/set_language', to: 'locales#set_language', as: :set_language

  get '/download/transitions',
      to: 'downloads#transitions',
      as: :download_transitions, defaults: { format: :xlsx }
  get '/download/statistics',
      to: 'downloads#statistics',
      as: :download_statistics, defaults: { format: :xlsx }

  get '/stats', to: 'stats#show', as: :stats

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
    resources :qualities, only: :index
    resources :statistics, only: :index
    resources :infra_levels, only: :index
    resources :infra_buffers, only: :index

    get '/inspector', to: 'inspector#index', as: :inspector
    get '/statistics/collection_2', to: 'statistics#collection_2', as: :collection_2_statistics
  end

  get 'discourse/sso', to: 'discourse_sso_sessions#authenticate'

  namespace :cms do
    resources :glossaries, only: [:new, :edit, :create, :update, :destroy]
    resources :faqs, only: [:new, :edit, :create, :update, :destroy]
  end

  resources :faqs, only: :index, path: 'faq'

  resources :glossaries, only: :index, path: 'glossary'
end
