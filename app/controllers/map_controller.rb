class MapController < ApplicationController
  before_action :authenticate_user!, except: [:index, :iframe]
  before_action :set_map, only: [:update, :iframe]
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

  def update
    @map.update(map_params)

    render json: @map
  end

  def my_maps
    @map_props = MapPresenter.new.as_json.merge({
      myMapsPage: true,
      myMaps: current_user.maps
    })

    render 'index'
  end

  def iframe
    @map_props = MapPresenter.new.as_json.merge({
      iframe: true,
      iframeMap: @map
    })

    response.headers['X-Frame-Options'] = 'ALLOWALL'

    render 'index', layout: 'iframe'
  end

  private

  def set_map
    @map = Map.find(params[:id])
  end

  def map_params
    params.require(:map).permit(
      :name
    ).merge(options: params[:map][:options])
  end
end
