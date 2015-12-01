class LocalesController < ActionController::Base
  def set_language
    return success if valid_locale?
    failure
  end

  private

  def valid_locale?
    locale = params[:locale].to_sym
    I18n.available_locales.include?(locale)
  end

  def success
    cookies[:locale] = params[:locale]
    render nothing: true, status: :ok
  end

  def failure
    render nothing: true, status: :forbidden
  end
end
