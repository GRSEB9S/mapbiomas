class MapPresenter
  MAPS_COLORS = {
    satellite: '#081B47'
  }

  QUALITY_INFO = [
    {
      api_name: '1',
      label: I18n.t('map.index.quality_labels.bad'),
      color: '#880000'
    },
    {
      api_name: '2',
      label: I18n.t('map.index.quality_labels.regular'),
      color: '#FCF35B'
    },
    {
      api_name: '3',
      label: I18n.t('map.index.quality_labels.good'),
      color: '#008800'
    },
    {
      api_name: 'null',
      label: I18n.t('map.index.quality_labels.undefined'),
      color: '#AAAAAA'
    },
    {
      api_name: '0',
      label: I18n.t('map.index.quality_labels.undefined'),
      color: '#AAAAAA'
    }
  ].freeze

  LAYERS_COLORS = {
    states: '#012700',
    cities: '#FF9900',
    contour_maps: '#5CA2D1',
    biomes: '#F11810',
    indigenous_lands: '#7B00B4',
    conservation_units: '#FF6600'
  }.freeze

  LAYERS_KEYS = {
    states:            '4dd47a54-01a8-11e6-86a9-0e31c9be1b51',
    cities:            '72b94172-0263-11e6-a087-0e5db1731f59',
    contour_maps:       '1413c17c-0274-11e6-ae17-0e787de82d45',
    biomes:            '201bcb2a-026c-11e6-9f9a-0e3ff518bd15',
    indigenous_lands:   '9294ef0a-04f2-11e6-8a00-0e31c9be1b51',
    conservation_units: 'c6f498c2-04f2-11e6-bedf-0ecd1babdde5'
  }.freeze

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
      qualityInfo: QUALITY_INFO,
      qualityCardsUrl: "https://s3.amazonaws.com/mapbiomas-ecostage/cartas_ibge_250000.geojson",
      apiUrl: ENV['TERRAS_API_URL']
    }
  end

  private

  def base_maps
    [
      {
        id: 0,
        slug: 'satellite',
        name: I18n.t('map.index.base_maps.satellite'),
        color: MAPS_COLORS[:satellite],
        link: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, USDA, USGS'
      }
    ]
  end

  def layers
    LAYERS_KEYS.each_with_index.map do |(layer, key), id|
      {
        id: id,
        slug: layer.to_s.camelize(:lower),
        name: I18n.t(layer, scope: 'map.index.layers'),
        color: LAYERS_COLORS[layer],
        link: "https://karydja.cartodb.com/api/v2/viz/#{key}/viz.json"
      }
    end
  end
end
