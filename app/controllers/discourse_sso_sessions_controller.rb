class DiscourseSsoSessionsController < ApplicationController
  def authenticate
    store_location_for :user, request.fullpath unless signed_in?

    authenticate_user!

    sso.email = current_user.email
    sso.name = current_user.name
    sso.username = current_user.name
    sso.external_id = current_user.id

    locale = cookies[:locale].to_s.tr('-', '_')

    redirect_to sso.to_url + "&locale=#{locale}"
  end

  private

  def query_string
    raise 'No payload was provided' if request.query_string.blank?
    request.query_string
  end

  def sso
    @sso ||= DiscourseApi::SingleSignOn
             .parse(query_string, DISCOURSE_SSO_SECRET)
             .tap { |sso| sso.sso_url = "#{ENV['DISCOURSE_URL']}/session/sso_login" }
  end
end
