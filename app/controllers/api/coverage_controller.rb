class API::CoverageController < ApplicationController
  respond_to :json

  def index
    @coverage = TerrasAPI.coverage(coverage_params[:year],
                                   coverage_params[:territory_id],
                                   coverage_params[:classification_ids])
    respond_with(@coverage)
  end

  def infra
    @infra_coverage = TerrasAPI.infra_coverage(infra_coverage_params[:territory_id],
                                               infra_coverage_params[:level_id],
                                               infra_coverage_params[:buffer],
                                               infra_coverage_params[:year])

    respond_with(@infra_coverage)
  end

  def car
    @car = TerrasAPI.car_coverage(car_coverage_params[:year], car_coverage_params[:territory_id])

    respond_with(@car)
  end

  private

  def coverage_params
    params.permit(:year, :territory_id, :classification_ids)
  end

  def infra_coverage_params
    params.permit(:territory_id, :level_id, :buffer, :year)
  end

  def car_coverage_params
    params.permit(:year, :territory_id)
  end
end
