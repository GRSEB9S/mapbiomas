class ApplicationController < ActionController::Base
  include Pundit

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :check_maintenance
  before_action :configure_permitted_parameters, if: :devise_controller?
  before_action :set_language
  before_action :store_user_location!, if: :storable_location?

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  protected

  def after_sign_in_path_for(_user)
    stored_location_for(:user) || my_maps_path
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end

  private

  # Its important that the location is NOT stored if:
  # - The request method is not GET (non idempotent)
  # - The request is handled by a Devise controller such as Devise::SessionsController as that could cause an
  #    infinite redirect loop.
  # - The request is an Ajax request as this can lead to very unexpected behaviour.
  def storable_location?
    request.get? && is_navigational_format? && !devise_controller? && !request.xhr?
  end

  def store_user_location!
    # :user is the scope we are authenticating
    store_location_for(:user, request.fullpath)
  end

  def check_maintenance
    render file: 'public/maintenance', layout: false if ENV['MAINTENANCE_MODE']
  end

  def set_language
    available_locales = I18n.available_locales
    cookies[:locale] ||= http_accept_language.preferred_language_from(available_locales)
    I18n.locale = cookies[:locale]
  end

  def user_not_authorized
    redirect_to(root_path)
  end
end
