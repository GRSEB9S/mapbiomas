import React from 'react';
import _ from 'underscore';
import lodash from 'lodash';
import classNames from 'classnames';

export class MapCanvas extends React.Component {
  constructor() {
    super();

    this.baseLayers = {};
    this.mapLayers = {};
    this.sideBySideLayers = {};
    this.dataLayer = null;;
    this.infraLayer = null;
  }

  get territoryArray() {
    if(_.isArray(this.props.territory)) {
      return this.props.territory;
    } else {
      return [this.props.territory];
    }
  }

  get baseLayerOptions() {
    return {
      layers: 'rgb',
      map: "wms/v/3.0/classification/rgb.map",
      year: this.props.year,
      format: 'image/png',
      transparent: true
    };
  }

  leftLayerOptions(mode) {
    let options;

    if (mode) {
      options = this.props.dataLayerOptions[this.props.mode];
    } else {
      options = this.baseLayerOptions;
    }

    return {
      ...options,
      year: this.props.years[0],
      zIndex: 2
    }
  }

  rightLayerOptions(mode) {
    let options;

    if (mode) {
      options = this.props.dataLayerOptions[this.props.mode];
    } else {
      options = this.baseLayerOptions;
    }

    return {
      ...options,
      year: this.props.years[1],
      zIndex: 2
    }
  }

  addBaseWMSLayer(baseMap) {
    let leftOptions = this.leftLayerOptions(baseMap.mode);
    let rightOptions = this.rightLayerOptions(baseMap.mode);

    let leftLayer = L.tileLayer.wms(baseMap.link, leftOptions).addTo(this.map);
    let rightLayer = L.tileLayer.wms(baseMap.link, rightOptions).addTo(this.map);
    let layer = L.control.sideBySide(leftLayer, rightLayer);

    this.sideBySideLayers[baseMap.slug] = layer;
    layer.addTo(this.map);
  }

  addBaseLayer(baseMap) {
    if (this.sideBySideLayers[baseMap.slug] ||
        this.baseLayers[baseMap.slug] ||
        (baseMap.data && this.props.mode != 'transitions')) {
      return;
    }

    let layer;

    if (baseMap.wms) {
      if (this.props.mode == 'transitions') {
        this.addBaseWMSLayer(baseMap);
        return;
      } else {
        layer = L.tileLayer.wms(baseMap.link, {
          ...this.baseLayerOptions,
          zIndex: 2
        });
      }
    } else {
      /*if(baseMap.googleMap) {
        layer = new L.Google(baseMap.type);

        this.map.addLayer(layer);
      }*/

      layer = L.tileLayer(baseMap.link, {
        zIndex: 1,
        attribution: baseMap.attribution
      }).addTo(this.map);
    }

    layer.on('loading', () => this.map.spin(true))
         .on('load', () => this.map.spin(false))
         .addTo(this.map);

    this.baseLayers[baseMap.slug] = layer;
  }

  removeBaseLayer(slug) {
    if (this.baseLayers[slug]) {
      const layer = this.baseLayers[slug];
      delete this.baseLayers[slug];
      this.map.removeLayer(layer);
    }
  }

  removeSideBySideLayer(slug) {
    if (this.sideBySideLayers[slug]) {
      const control = this.sideBySideLayers[slug];
      delete this.sideBySideLayers[slug];
      this.map.removeLayer(control.getLeftLayer());
      this.map.removeLayer(control.getRightLayer());
      control.remove();
    }
  }

  updateBaseLayers() {
    _.each(this.sideBySideLayers, (layer, slug) => {
      let baseLayer = _.find(this.props.baseMaps, (m) => m.slug == slug)
      let mode = baseLayer.mode;

      layer.updateLeftLayer(this.leftLayerOptions(mode));
      layer.updateRightLayer(this.rightLayerOptions(mode));
    })

    _.each(this.baseLayers, (layer) => {
      if (layer.wmsParams) {
        layer.setParams(this.baseLayerOptions);
      }
    });
  }

  setupBaseLayers() {
    const baseMaps = this.props.selectedBaseMaps;
    const baseMapsSlugs = _.reduce(baseMaps, (acc, { slug }) => (
      {...acc, [slug]: true}
    ), {});

    _.each(baseMaps, (map) => {
      if (this.props.mode == 'transitions' && map.wms) {
        this.removeBaseLayer(map.slug);
      }

      if (this.props.mode != 'transitions' && map.wms) {
        this.removeSideBySideLayer(map.slug);
      }

      this.addBaseLayer(map);
    })

    _.each(this.baseLayers, (layer, slug) => {
      if (!baseMapsSlugs[slug]) {
        this.removeBaseLayer(slug);
      }
    });

    _.each(this.sideBySideLayers, (layer, slug) => {
      if (!baseMapsSlugs[slug]) {
        this.removeSideBySideLayer(slug);
      }
    });
  }

  setupTerritory() {
    if (!this.props.myMapsPage && !this.props.iframe) {
      this.map.fitBounds(_.last(this.territoryArray).bounds);
    }
  }

  setupMyMapTerritories() {
    if (this.props.myMapsPage || this.props.iframe) {
      let result = new L.LatLngBounds;

      _.each(this.props.territory, (t) => {
        result = result.extend(t.bounds);
      });

      this.map.fitBounds(result);
    }
  }

  addMapLayer(mapLayer) {
    if (this.mapLayers[mapLayer.slug]) {
      return;
    }

    if (mapLayer.fromCarto) {
      cartodb.createLayer(this.map, mapLayer.link)
        .addTo(this.map)
        .done((layer) => {
          layer.on('loading', () => this.map.spin(true));
          layer.on('load', () => this.map.spin(false));

          if (_.find(this.props.selectedLayers, { slug: mapLayer.slug })) {
            layer.setZIndex(10);
            this.mapLayers[mapLayer.slug] = layer;
          } else {
            this.map.removeLayer(layer);
          }
        });
    } else {
      let layer;

      if (mapLayer.wms) {
        layer = L.tileLayer.wms(mapLayer.link, mapLayer.params)
          .on('loading', () => this.map.spin(true))
          .on('load', () => this.map.spin(false))
          .addTo(this.map)
      }

      else {
        layer = new L.TileLayer.WMTS(mapLayer.link, mapLayer.params)
          .on('loading', () => this.map.spin(true))
          .on('load', () => this.map.spin(false))

        this.map.addLayer(layer);
      }

      layer.setZIndex(10);
      this.mapLayers[mapLayer.slug] = layer;
    }
  }

  removeMapLayer(slug) {
    if (this.mapLayers[slug]) {
      const layer = this.mapLayers[slug];

      delete this.mapLayers[slug];
      this.map.removeLayer(layer);
    }
  }

  setupMapLayers() {
    const mapLayers = this.props.selectedLayers;
    const mapLayersSlugs = _.reduce(mapLayers, (acc, { slug }) => (
      {...acc, [slug]: true}
    ), {});

    _.each(mapLayers, this.addMapLayer.bind(this));
    _.each(this.mapLayers, (layer, slug) => {
      if (!mapLayersSlugs[slug]) {
        this.removeMapLayer(slug);
      }
    });
  }

  setupDataLayer() {
    let layerOptions = this.props.dataLayerOptions[this.props.mode];
    let options = {
      format: 'image/png',
      transparent: true,
      opacity: 1,
      attribution: 'MapBiomas Workspace',
      zIndex: 3,
      ...layerOptions
    };

    if (options.territory_id) {
      options.territory_id = _.map(this.territoryArray, (t) => t.value);
    }

    if (options.year) {
      options.year = this.props.year;
    }

    if (this.dataLayer) {
      if (layerOptions && layerOptions.transitions_group && _.isEmpty(layerOptions.transitions_group)) {
        this.dataLayer.setOpacity(0);
        return;
      }

      this.dataLayer.setParams(options);
      this.dataLayer.setOpacity(this.props.opacity);
    } else {
      this.dataLayer = L.tileLayer.wms(`${this.props.apiUrl}/wms`, options)
        .on('loading', () => this.map.spin(true))
        .on('load', () => this.map.spin(false))
        .on('tileunload', () => this.map.spin(false))
        .addTo(this.map);
    }
  }

  setupInfraLayer() {
    if (this.infraLayer && this.props.mode == 'quality') {
      this.infraLayer.setOpacity(0);
      return;
    }

    if (this.props.mode != 'quality') {
      if (this.infraLayer) {
        let groupedInfraLayers = lodash.groupBy(this.props.selectedInfraLevels, 'categoria');
        let cqlFilter = lodash.map(groupedInfraLayers, (value, key) => {
          let categories = lodash.join(_.map(value, (v) => `'${v.name}'`), ',');

          return `category_${key} IN (${categories})`
        });
        let options = lodash.clone(this.props.infraLayer.params);

        cqlFilter = lodash.join(cqlFilter, ' OR ');
        options = {
          ...this.props.infraLayer.params,
          cql_filter: cqlFilter
        };

        this.infraLayer.setParams(options);
        this.infraLayer.setOpacity(1);
      } else {
        this.infraLayer = L.tileLayer.wms(this.props.infraLayer.link, this.props.infraLayer.params)
          .on('loading', () => this.map.spin(true))
          .on('load', () => this.map.spin(false))
          .on('tileunload', () => this.map.spin(false))
          .addTo(this.map);
      }

      if (_.isEmpty(this.props.selectedInfraLevels)) {
        this.infraLayer.setOpacity(0);
      }
    }
  }

  setupMapCoordinatesControl() {
    if (this.props.mainMap){
      L.control.coordinates({
        position: 'bottomright',
        decimalSeperator: I18n.t('number.format.separator'),
        useLatLngOrder: true,
        labelTemplateLat: `${I18n.t('geolocation.latitude')}: {y}`,
        labelTemplateLng: `${I18n.t('geolocation.longitude')}: {x}`
      }).addTo(this.map);
    }
  }

  setupScaleControl() {
    if (this.props.mainMap){
      L.control.betterscale({ imperial: false, metric: true }).addTo(this.map);
    }
  }

  componentDidUpdate(prevProps) {
    let sameTerritory = prevProps.territory.id == this.props.territory.id;
    let sameTerritories = (prevProps.territory.length == this.props.territory.length) && _.every(this.props.territory, (t) => {
      return _.find(prevProps.territory, (p) => p.id == t.id);
    });

    if ((!_.isArray(this.props.territory) && !sameTerritory) || (_.isArray(this.props.territory) && !sameTerritories)) {
      this.setupTerritory();
      this.setupMyMapTerritories();
      this.setupDataLayer();
    }

    if ((prevProps.selectedBaseMaps != this.props.selectedBaseMaps) || (prevProps.mode != this.props.mode)) {
      this.setupBaseLayers();
    }

    if (this.props.mode != 'transitions' && prevProps.year != this.props.year) {
      this.updateBaseLayers();
    }

    if (this.props.mode == 'transitions' && !_.isEqual(prevProps.years, this.props.years)) {
      this.updateBaseLayers();
    }

    if (prevProps.mode != this.props.mode || !_.isEqual(prevProps.dataLayerOptions, this.props.dataLayerOptions)) {
      this.setupDataLayer();
    }

    if (!this.props.mainMap && !_.isEqual(prevProps.year, this.props.year)) {
      this.setupDataLayer();
    }

    if (prevProps.opacity != this.props.opacity) {
      this.dataLayer.setOpacity(this.props.opacity);
    }

    if (prevProps.selectedLayers != this.props.selectedLayers) {
      this.setupMapLayers();
    }

    if (prevProps.mode != this.props.mode || !_.isEqual(prevProps.selectedInfraLevels, this.props.selectedInfraLevels)) {
      this.setupInfraLayer();
    }
  }

  componentDidMount() {
    const node = this.refs.element;
    this.map = L.map(node, { zoomControl: false, minZoom: 4 })
                .setView([-20, -45], 6)
                .on('layerremove', () => this.map.spin(false));

    if (this.props.mainMap) {
      this.map.on('click', (e) => this.props.onPointClick(e));
    }

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.setupTerritory();
    this.setupMyMapTerritories();
    this.setupDataLayer();
    this.setupInfraLayer();
    this.setupBaseLayers();
    this.setupMapLayers();
    this.setupMapCoordinatesControl();
    this.setupScaleControl();
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  render() {
    let classes = classNames(
      'map__canvas leaflet-container', {
        'point-click': this.props.pointClick
      }
    );

    return (
      <div className={ classes } ref="element" />
    );
  }
}
