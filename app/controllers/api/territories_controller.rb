class API::TerritoriesController < ApplicationController
  respond_to :json

  def index
    @territories = TerrasAPI.territories
    respond_with(@territories)
  end
end
