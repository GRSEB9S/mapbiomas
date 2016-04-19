class MapPresenter
  MAPS_COLORS = {
    satellite: '#081B47'
  }

  LAYERS_COLORS = {
    states: '#012700',
    cities: '#FF9900',
    contour_maps: '#5CA2D1',
    biomes: '#F11810',
    indigenous_lands: '#7B00B4',
    conservation_units: '#FF6600'
  }

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
        slug: 'satellite',
        name: I18n.t('map.index.base_maps.satellite'),
        color: MAPS_COLORS[:satellite],
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
        color: LAYERS_COLORS[:states],
        link: 'https://karydja.cartodb.com/api/v2/viz/4dd47a54-01a8-11e6-86a9-0e31c9be1b51/viz.json'
      },
      {
        id: 1,
        slug: 'cities',
        name: I18n.t('map.index.layers.cities'),
        color: LAYERS_COLORS[:cities],
        link: 'https://karydja.cartodb.com/api/v2/viz/72b94172-0263-11e6-a087-0e5db1731f59/viz.json'
      },
      {
        id: 2,
        slug: 'contourMaps',
        name: I18n.t('map.index.layers.contour_maps'),
        color: LAYERS_COLORS[:contour_maps],
        link: 'https://karydja.cartodb.com/api/v2/viz/1413c17c-0274-11e6-ae17-0e787de82d45/viz.json'
      },
      {
        id: 3,
        slug: 'biomes',
        name: I18n.t('map.index.layers.biomes'),
        color: LAYERS_COLORS[:biomes],
        link: 'https://karydja.cartodb.com/api/v2/viz/201bcb2a-026c-11e6-9f9a-0e3ff518bd15/viz.json'
      },
      {
        id: 4,
        slug: 'indigenousLands',
        name: I18n.t('map.index.layers.indigenous_lands'),
        color: LAYERS_COLORS[:indigenous_lands],
        link: 'https://karydja.cartodb.com/api/v2/viz/9294ef0a-04f2-11e6-8a00-0e31c9be1b51/viz.json'
      },
      {
        id: 5,
        slug: 'conservationUnits',
        name: I18n.t('map.index.layers.conservation_units'),
        color: LAYERS_COLORS[:conservation_units],
        link: 'https://karydja.cartodb.com/api/v2/viz/c6f498c2-04f2-11e6-bedf-0ecd1babdde5/viz.json'
      }
    ]
  end
end
