class MapPresenter
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
    states: '4dd47a54-01a8-11e6-86a9-0e31c9be1b51',
    cities: 'e39c46c1-a410-43db-9af3-000cd2967463',
    contour_maps: '1413c17c-0274-11e6-ae17-0e787de82d45',
    biomes: '201bcb2a-026c-11e6-9f9a-0e3ff518bd15',
    indigenous_lands: 'adecbf9e-1c1e-43ec-ae8b-f9d340d7fc6f',
    conservation_units: 'e916c222-1999-412f-b2eb-666c8958dfcd',
    macro_watersheds: '93e5c68c-2189-4edb-a311-c9bca9db821b',
    watersheds: '31033250-92f9-49ac-bc02-87b68c67498a'
  }.freeze

  def as_json(*_)
    {
      availableClassifications: sorted_classifications,
      defaultClassifications: sorted_classifications,
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

  def sorted_classifications
    @sorted_classifications ||= TerrasAPI.classifications.sort_by { |c| c['id'] }
  end

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

  def esri_imagery
    {
      id: 5,
      slug: 'esri-imagery',
      name: I18n.t('map.index.base_maps.esri_imagery'),
      link: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    }
  end

  def openstreet_mapnik
    {
      id: 4,
      slug: 'openstreet-mapnik',
      name: I18n.t('map.index.base_maps.openstreet_mapnik'),
      link: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  end

  def esri_relief
    {
      id: 6,
      slug: 'esri-relief',
      name: I18n.t('map.index.base_maps.esri_relief'),
      link: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'
    }
  end

  def coverage_data
    {
      id: 7,
      slug: 'coverage-data',
      name: I18n.t('map.index.base_maps.coverage_data'),
      data: true,
      mode: 'coverage',
      wms: true,
      color: nil,
      link: "#{ENV['TERRAS_MAP_API_URL']}/wms"
    }
  end

  def smallholder_settlements
    {
      id: 8,
      slug: 'smallholder-settlements',
      name: I18n.t('map.index.base_maps.smallholder_settlements'),
      link: "#{ENV['TERRAS_MAP_API_URL']}/wms",
      params: {
        map: 'wms/v/2.3/territories/assentamentos.map',
        color_id: 2,
        layers: 'assentamentos',
        format: 'image/png',
        transparent: true
      }
    }
  end

  def afro_brazilian_settlements
    {
      id: 9,
      slug: 'afro-brazilian-settlements',
      name: I18n.t('map.index.base_maps.afro_brazilian_settlements'),
      link: "#{ENV['TERRAS_MAP_API_URL']}/wms",
      params: {
        map: 'wms/v/2.3/territories/quilombolas.map',
        color_id: 2,
        layers: 'quilombolas',
        format: 'image/png',
        transparent: true
      }
    }
  end

  def base_maps
    [coverage_data, rgb_landsat, esri_imagery, openstreet_mapnik, esri_relief]
  end

  def layers
    LAYERS_KEYS.each_with_index.map do |(layer, key), id|
      {
        id: id,
        slug: layer.to_s.tr('_', '-'),
        name: I18n.t(layer, scope: 'map.index.layers'),
        fromCarto: true,
        link: "https://karydja.carto.com/api/v2/viz/#{key}/viz.json"
      }
    end << smallholder_settlements << afro_brazilian_settlements
  end
end
