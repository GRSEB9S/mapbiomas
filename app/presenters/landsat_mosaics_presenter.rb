class LandsatMosaicsPresenter
  def as_json(*_)
    {
      availableTerritories: TerrasAPI.territories,
      defaultTerritory: TerrasAPI.territories.first,
      availableYears: Setting.available_years,
      cardsUrl: "https://s3.amazonaws.com/mapbiomas-ecostage/cartas_ibge_250000.geojson"
    }
  end
end
