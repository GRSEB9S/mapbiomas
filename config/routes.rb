Rails.application.routes.draw do
  root 'map#index'

  get 'pages/methodology', to: 'pages#methodology', as: 'pages_methodology'
  get 'pages/about', to: 'pages#about', as: 'pages_about'
  get 'pages/download_notes', to: 'pages#download_notes', as: 'download_notes'

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
    resources :coverage, only: :index
    resources :territories, only: :index
    resources :transitions, only: :index
  end
end
