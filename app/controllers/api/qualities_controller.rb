class API::QualitiesController < ApplicationController
  respond_to :json

  def index
    @qualities = TerrasAPI.qualities(qualities_params[:year])
    respond_with(@qualities)
  end

  private

  def qualities_params
    params.permit(:year)
  end
end
