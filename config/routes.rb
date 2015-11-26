Rails.application.routes.draw do
  root 'high_voltage/pages#show', id: 'home'
  get '/map'=>'map#index', as: :map

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
  end
end
