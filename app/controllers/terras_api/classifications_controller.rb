class TerrasAPI::ClassificationsController < ApplicationController
  def index
    @classifications = TerrasAPI.classifications
  end
end
