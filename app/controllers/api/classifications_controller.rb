class API::ClassificationsController < ApplicationController
  respond_to :json

  def index
    @classifications = TerrasAPI.classifications
    respond_with(@classifications)
  end
end
