class TerrasAPI::TerritoriesController < ApplicationController
  def index
    @territories = TerrasAPI.territories
  end
end
