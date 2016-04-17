class MapPresenter
  def as_json(*_)
    {
      availableClassifications: TerrasAPI.classifications,
      defaultClassifications: TerrasAPI.classifications,
      availableBaseMaps: base_maps,
      defaultBaseMaps: [],
      availableLayers: layers,
      defaultLayers: [],
      availableTerritories: TerrasAPI.territories,
      defaultTerritory: TerrasAPI.territories.first,
      availableYears: Setting.available_years,
      url: ENV['TERRAS_API_URL']
    }
  end

  private

  def base_maps
    [
      {
        id: 0,
        slug: 'googleEarth',
        name: I18n.t('map.index.base_maps.google_earth'),
        link: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, USDA, USGS'
      }
    ]
  end

  def layers
    [
      {
        id: 0,
        slug: 'states',
        name: I18n.t('map.index.layers.states'),
        link: 'https://karydja.cartodb.com/api/v2/viz/4dd47a54-01a8-11e6-86a9-0e31c9be1b51/viz.json'
      },
      {
        id: 1,
        slug: 'cities',
        name: I18n.t('map.index.layers.cities'),
        link: 'https://karydja.cartodb.com/api/v2/viz/72b94172-0263-11e6-a087-0e5db1731f59/viz.json'
      },
      {
        id: 2,
        slug: 'contourMaps',
        name: I18n.t('map.index.layers.contour_maps'),
        link: 'https://karydja.cartodb.com/api/v2/viz/1413c17c-0274-11e6-ae17-0e787de82d45/viz.json'
      },
      {
        id: 3,
        slug: 'biomes',
        name: I18n.t('map.index.layers.biomes'),
        link: 'https://karydja.cartodb.com/api/v2/viz/201bcb2a-026c-11e6-9f9a-0e3ff518bd15/viz.json'
      }
    ]
  end
end
