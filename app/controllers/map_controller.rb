class MapController < ApplicationController
  before_action :authenticate_user!, except: :index
  respond_to :json, only: :create

  def index
    @map_props = MapPresenter.new
  end

  def create
    @map = Map.create(
      map_params.merge({ user: current_user })
    )

    respond_with(@map)
  end

  def my_maps
    @map_props = MapPresenter.new.as_json.merge({
      myMapsPage: true,
      myMaps: current_user.maps
    })
  end

  private

  def map_params
    params.require(:map).permit(
      :name
    ).merge(options: params[:map][:options])
  end
end
