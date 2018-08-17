class API::CarController < ApplicationController
  respond_to :json

  def index
    @car = TerrasAPI.car(car_params[:year], car_params[:territory_id])

    respond_with(@car)
  end

  private

  def car_params
    params.permit(:year, :territory_id)
  end
end
