class API::TerritoriesController < ApplicationController
  respond_to :json

  def index
    @territories = TerrasAPI.territories(territories_params[:name])
    respond_with(@territories)
  end

  private

  def territories_params
    params.permit(:name)
  end
end
