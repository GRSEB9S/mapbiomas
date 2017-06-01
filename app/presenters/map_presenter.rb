class MapPresenter
  MAPS_COLORS = {
    satellite: '#081B47'
  }

  QUALITY_INFO = [
    {
      api_name: '1',
      label: I18n.t('map.index.quality.chart.bad'),
      color: '#880000'
    },
    {
      api_name: '2',
      label: I18n.t('map.index.quality.chart.regular'),
      color: '#FCF35B'
    },
    {
      api_name: '3',
      label: I18n.t('map.index.quality.chart.good'),
      color: '#008800'
    },
    {
      api_name: 'null',
      label: I18n.t('map.index.quality.chart.undefined'),
      color: '#AAAAAA'
    },
    {
      api_name: '0',
      label: I18n.t('map.index.quality.chart.undefined'),
      color: '#AAAAAA'
    }
  ].freeze

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
      defaultTerritory: TerrasAPI.territories.first,
      availableYears: Setting.available_years,
      qualityInfo: QUALITY_INFO,
      qualityCardsUrl: 'https://s3.amazonaws.com/mapbiomas-ecostage/cartas_ibge_250000.geojson',
      qualityDataUrl: 'https://s3.amazonaws.com/mapbiomas-ecostage/Avalia%C3%A7%C3%A3o_Qualitativa_Mosaicos_COLECAO++1+-+V3.xlsx',
      apiUrl: ENV['TERRAS_MAP_API_URL']
    }
  end

  private

  def rgb_landsat
    {
      id: 0,
      slug: 'rgb-landsat',
      name: I18n.t('map.index.base_maps.rgb_landsat'),
      wms: true,
      color: nil,
      link: 'http://seeg-mapbiomas.terras.agr.br:3000'
    }
  end

  def satellite_map
    {
      id: 1,
      slug: 'satellite',
      type: 'SATELLITE',
      name: I18n.t('map.index.base_maps.satellite'),
      googleMap: true,
      color: nil
    }
  end

  def roadmap_map
    {
      id: 2,
      slug: 'roadmap',
      type: 'ROADMAP',
      name: I18n.t('map.index.base_maps.roadmap'),
      googleMap: true,
      color: nil
    }
  end

  def terrain_map
    {
      id: 3,
      slug: 'terrain',
      type: 'TERRAIN',
      name: I18n.t('map.index.base_maps.terrain'),
      googleMap: true,
      color: nil
    }
  end

  def base_maps
    [
      rgb_landsat,
      satellite_map,
      roadmap_map,
      terrain_map
    ]
  end

  def layers
    LAYERS_KEYS.each_with_index.map do |(layer, key), id|
      {
        id: id,
        slug: layer.to_s.tr('_', '-'),
        name: I18n.t(layer, scope: 'map.index.layers'),
        fromCarto: true,
        link: "https://karydja.cartodb.com/api/v2/viz/#{key}/viz.json"
      }
    end
  end
end
