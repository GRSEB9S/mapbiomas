class API::InfraLevelsController < ApplicationController
  respond_to :json

  def index
    @infra_levels = TerrasAPI.infra_levels

    respond_with(@infra_levels)
  end
end
