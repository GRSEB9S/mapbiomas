class MapPresenter
  LAYERS_MAPS_AND_LAYERS = {
    states: { map: 'wms/v/3.0/territories/estados.map', layer: 'estados' },
    cities: { map: 'wms/v/3.0/territories/municipios.map', layer: 'municipios' },
    contour_maps: { map: 'wms/v/3.0/territories/cartas.map', layer: 'cartas' },
    biomes: { map: 'wms/v/3.0/territories/bioma_contorno.map', layer: 'bioma' },
    indigenous_lands: { map: 'wms/v/3.0/territories/terra_indigena.map', layer: 'tis' },
    conservation_units: { map: 'wms/v/3.0/territories/unidades_conservacao.map', layer: 'ucs' },
    macro_watersheds: { map: 'wms/v/3.0/territories/baciasn1.map', layer: 'baciasn1' },
    watersheds: { map: 'wms/v/3.0/territories/baciasn2.map', layer: 'baciasn2' },
    afro_brazilian_settlements: { map: 'wms/v/3.0/territories/quilombolas.map', layer: 'quilombolas' },
    smallholder_settlements: { map: 'wms/v/3.0/territories/assentamentos.map', layer: 'assentamentos' }
  }.freeze

  def as_json(*_)
    {
      availableClassifications: sorted_classifications,
      defaultClassifications: sorted_classifications,
      availableBaseMaps: base_maps,
      defaultBaseMaps: [],
      availableLayers: layers,
      availableInfraLevels: infra_levels,
      infraLayer: infra_layer,
      carLayer: car_layer,
      defaultLayers: [],
      defaultTerritory: TerrasAPI.territories.first,
      availableYears: Setting.available_years,
      defaultYear: Setting.default_year,
      apiUrl: ENV['TERRAS_MAP_API_URL']
    }
  end

  private

  def infra_levels
    @infra_levels ||= TerrasAPI.infra_levels
  end

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
      link: 'http://seeg-mapbiomas.terras.agr.br/wms'
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

  def infra_layer
    {
      link: 'http://geoserver.ecostage.com.br/geoserver/mapbiomas/wms',
      params: {
        layers: 'mapbiomas:infrastructure_map',
        format: 'image/png',
        transparent: true,
        tiled: true,
        zIndex: 10
      }
    }
  end

  def car_layer
    {
      link: 'http://geoserver.imaflora.org/geoserver/ima-geo/wms',
      params: {
        layers: 'ima-geo:v_car0518_mapbiomas',
        transparent: true,
        tilematrixSet: 'EPSG:3857',
        format: 'image/png',
        zIndex: 10
      }
    }
  end

  def base_maps
    [coverage_data, rgb_landsat, esri_imagery, openstreet_mapnik, esri_relief]
  end

  def layers
    LAYERS_MAPS_AND_LAYERS.each_with_index.map do |(layer, hash), id|
      {
        id: id,
        slug: layer.to_s.tr('_', '-'),
        name: I18n.t("map.index.layers.#{layer}"),
        wms: true,
        link: "#{ENV['TERRAS_MAP_API_URL']}/wms",
        params: {
          map: hash[:map],
          layers: hash[:layer],
          format: 'image/png',
          srs: 'EPSG:4326',
          transparent: true
        }
      }
    end
  end
end
