class API::InfraBuffersController < ApplicationController
  respond_to :json

  def index
    @infra_buffer = TerrasAPI.infra_buffer(infra_buffer_params)
    respond_with(@infra_buffer)
  end

  private

  def infra_buffer_params
    params.permit(:category_id, :category_name, :territory_id, :buffer)
  end
end

