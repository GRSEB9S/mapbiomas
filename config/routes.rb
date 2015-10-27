Rails.application.routes.draw do
  root 'map#index'

  namespace :api, defaults: { format: :json } do
    resources :classifications, only: :index
  end
end
