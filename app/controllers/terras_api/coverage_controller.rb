class TerrasAPI::CoverageController < ApplicationController
  respond_to :json

  def index
    @coverage = TerrasAPI.coverage(coverage_params[:year],
                                   coverage_params[:territory_id],
                                   coverage_params[:classification_ids])
    respond_with(@coverage)
  end

  private

  def coverage_params
    params.permit(:year, :territory_id, :classification_ids)
  end
end
