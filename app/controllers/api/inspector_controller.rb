class API::InspectorController < ApplicationController
  respond_to :json

  def index
    @inspector = TerrasAPI.inspector(inspector_params[:year],
                                     inspector_params[:lat],
                                     inspector_params[:lng])
    respond_with(@inspector)
  end

  private

  def inspector_params
    params.permit(:year, :lat, :lng)
  end
end
