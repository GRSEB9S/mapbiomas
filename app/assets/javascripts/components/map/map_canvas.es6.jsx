import _ from 'underscore';
import React from 'react';

export class MapCanvas extends React.Component {
  constructor() {
    super();

    this.baseLayers = {};
    this.mapLayers = {};
    this.classificationLayers = {};
    this.dataLayer = null;;
    this.cardsLayer = null;
  }

  get getBaseLayerOptions() {
    let year = this.props.mode == 'transitions' ? this.props.years[1] : this.props.year;

    return {
      layers: 'rgb',
      map: "wms/classification/rgb.map",
      year: year,
      format: 'image/png',
      transparent: true
    };
  }

  addBaseLayer(baseMap) {
    if (this.baseLayers[baseMap.slug]) {
      return;
    }

    let layer;

    if (baseMap.wms) {
      layer = L.tileLayer.wms(baseMap.link, this.getBaseLayerOptions)
      .addTo(this.map);
    } else {
      if(baseMap.googleMap) {
        layer = new L.Google(baseMap.type);

        this.map.addLayer(layer);
      } else {
        layer = L.tileLayer(baseMap.link, {
          zIndex: 1,
          attribution: baseMap.attribution
        }).addTo(this.map);
      }
    }

    this.baseLayers[baseMap.slug] = layer;
  }

  removeBaseLayer(slug) {
    if (this.baseLayers[slug]) {
      const layer = this.baseLayers[slug];
      delete this.baseLayers[slug];
      this.map.removeLayer(layer);
    }
  }

  updateBaseLayers() {
    _.each(this.baseLayers, (layer) => {
      if (layer.wmsParams) {
        layer.setParams(this.getBaseLayerOptions);
      }
    });
  }

  setupBaseLayers() {
    const baseMaps = this.props.selectedBaseMaps;
    const baseMapsSlugs = _.reduce(baseMaps, (acc, { slug }) => (
      {...acc, [slug]: true}
    ), {});

    _.each(baseMaps, this.addBaseLayer.bind(this));
    _.each(this.baseLayers, (layer, slug) => {
      if (!baseMapsSlugs[slug]) {
        this.removeBaseLayer(slug);
      }
    });
  }

  setupTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
  }

  addMapLayer(mapLayer) {
    if (this.mapLayers[mapLayer.slug]) {
      return;
    }

    cartodb.createLayer(this.map, mapLayer.link)
    .addTo(this.map)
    .done((layer) => {
      if (_.find(this.props.selectedLayers, { slug: mapLayer.slug })) {
        layer.setZIndex(10);
        this.mapLayers[mapLayer.slug] = layer;
      } else {
        this.map.removeLayer(layer);
      }
    });
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
    const { url, ...layerOptions } = this.props.layerOptions;
    const options = {
      format: 'image/png',
      transparent: true,
      opacity: 1,
      attribution: 'MapBiomas Workspace',
      zIndex: 3,
      ...layerOptions
    };

    if (this.dataLayer) {
      this.dataLayer.setParams(options);
    } else {
      this.dataLayer = L.tileLayer.wms(`${url}/wms`, options)
        .addTo(this.map);
    }
  }

  setupCardsLayer() {
    if (this.cardsLayer) {
      this.map.removeLayer(this.cardsLayer);
    }

    if (this.props.mode !== 'quality') {
      return;
    }

    const style = {
      color: '#000',
      fillColor: '#aaa',
      fillOpacity: 0.5,
      weight: 0.2
    };

    this.cardsLayer = L.geoJson(this.props.cards, {
      style: (feature) => {
        const quality = _.findWhere(this.props.qualities, { name: feature.properties.name });

        if (quality) {
          return {
            ...style,
            fillColor: _.findWhere(this.props.qualityInfo, { api_name: String(quality.quality) }).color
          };
        } else {
          return style;
        }
      }
    })
    .addTo(this.map);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.territory.id != this.props.territory.id) {
      this.setupTerritory();
    }

    if (prevProps.selectedBaseMaps != this.props.selectedBaseMaps) {
      this.setupBaseLayers();
    }

    if (this.props.mode != 'transitions' && prevProps.year != this.props.year) {
      this.updateBaseLayers();
    }

    if (this.props.mode == 'transitions' && prevProps.years != this.props.years) {
      this.updateBaseLayers();
    }

    if (!_.isEqual(prevProps.layerOptions, this.props.layerOptions)) {
      this.setupDataLayer();
    }

    if (prevProps.opacity != this.props.opacity) {
      this.dataLayer.setOpacity(this.props.opacity);
    }

    if (
      (prevProps.mode !== this.props.mode) ||
      (!_.isEqual(prevProps.qualities, this.props.qualities)) ||
      (!_.isEqual(prevProps.cards, this.props.cards))
    ) {
      this.setupCardsLayer();
    }

    if (prevProps.selectedLayers != this.props.selectedLayers) {
      this.setupMapLayers();
    }
  }

  componentDidMount() {
    const node = this.refs.element;
    this.map = L.map(node, { zoomControl: false, minZoom: 4 }).setView([-20, -45], 6);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.setupTerritory();
    this.setupCardsLayer();
    this.setupDataLayer();
    this.setupBaseLayers();
    this.setupMapLayers();
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  render() {
    return (
      <div className="map__canvas" ref="element" />
    );
  }
}
