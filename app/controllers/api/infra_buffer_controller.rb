class API::InfraBufferController < ApplicationController
  respond_to :json

  def index
    @infra_buffer = TerrasAPI.infra_buffer(params[:territory_id],
                                            params[:category_id],
                                            params[:category_name])
    respond_with(@infra_buffer)
  end

  private

  def infra_buffer_params
    params.permit(:category_id, :category_name, :territory_id)
  end
end
