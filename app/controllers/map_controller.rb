class MapController < ApplicationController
  def index
    @map_props = {
      classifications: TerrasAPI.classifications,
      defaultClassifications: TerrasAPI.classifications.map { |c| c[:id] }
    }
  end
end
