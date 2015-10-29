class MapController < ApplicationController
  def index
    @map_props = {
      availableClassifications: TerrasAPI.classifications,
      defaultClassifications: TerrasAPI.classifications,
      availableTerritories: TerrasAPI.territories,
      defaultTerritory: TerrasAPI.territories.first
    }
  end
end
