class MapController < ApplicationController
  def index
    @map_props = MapPresenter.new
  end
end
