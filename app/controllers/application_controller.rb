class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  #before_action :set_language

  private

  def set_language
    available_locales = I18n.available_locales
    cookies[:locale] ||= http_accept_language.preferred_language_from(available_locales)
    I18n.locale = cookies[:locale]
  end
end
