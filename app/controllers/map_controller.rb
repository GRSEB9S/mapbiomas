class MapController < ApplicationController
  def index
    @map_props = {
      classifications: TerrasAPI.classifications,
      defaultClassifications: TerrasAPI.classifications.map { |c| c['id'] },
      territories: TerrasAPI.territories,
      defaultTerritory: TerrasAPI.territories.first['id']
    }
  end
end
