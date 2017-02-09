import React from 'react';
import _ from 'underscore';

export class MapCanvas extends React.Component {
  constructor() {
    super();

    this.state = {
      cards: null
    }

    this.baseMaps = {};
    this.layers = {};
    this.cardsLayer = null;
  }

  get options() {
    let defaultOptions = {
      format: 'image/png',
      transparent: true,
      opacity: 0.6,
      attribution: "MapBiomas Workspace"
    }
    return _.defaults({}, this.props.layerOptions, defaultOptions);
  }

  get baseMapsSlugs() {
    return _.map(this.props.selectedBaseMaps, (baseMap) => {
      return baseMap.slug;
    });
  }

  get layersSlugs() {
    return _.map(this.props.selectedLayers, (layer) => {
      return layer.slug;
    });
  }

  get wmsMaps() {
    return _.filter(this.props.baseMaps, (map) => {
      return map.wms;
    });
  }

  get wmsMapOptions() {
    return {
      layers: 'rgb',
      map: "wms/classification/rgb.map",
      year: this.props.year,
      format: 'image/png',
      transparent: true
    };
  }

  addBaseMaps(map) {
    _.each(this.props.baseMaps, (baseMap) => {
      let newMap;

      if(baseMap.wms) {
        newMap = L.tileLayer.wms(baseMap.link, this.wmsMapOptions).addTo(map);
      } else {
        newMap = L.tileLayer(baseMap.link, {
          attribution: baseMap.attribution
        }).addTo(this.map);
      }

      this.baseMaps[baseMap.slug] = newMap;
      newMap.setOpacity(0);
    });
  }

  addLayers(map) {
    _.each(this.props.layers, (layer) => {
      cartodb.createLayer(map, layer.link)
        .addTo(map)
        .done((mapLayer) => {
          this.layers[layer.slug] = mapLayer;
          mapLayer.setOpacity(0);
        });
    });
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node).setView([-20, -45], 6);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.setQualityLayer();
    this.addBaseMaps(this.map);
    this.addLayers(this.map);

    this.dataLayer = L.tileLayer.wms(
      `${this.options.url}/cgi-bin/mapserv`,
      this.options
    ).addTo(this.map);

    this.fitTerritory();
  }

  updateWmsMaps() {
    _.each(this.wmsMaps, (map) => {
      let wmsMap = this.baseMaps[map.slug];

      wmsMap.setParams(this.wmsMapOptions);
    });
  }

  fitTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
  }

  setBaseMapsOpacity() {
    _.each(this.baseMaps, (value, key) => {
      if(_.contains(this.baseMapsSlugs, key)) {
        this.baseMaps[key].setOpacity(1);
      } else {
        this.baseMaps[key].setOpacity(0);
      }
    });
  }

  setLayersOpacity() {
    _.each(this.layers, (value, key) => {
      if(_.contains(this.layersSlugs, key)) {
        this.layers[key].setOpacity(1);
      } else {
        this.layers[key].setOpacity(0);
      }
    });
  }

  setQualityLayer() {
    if(this.cardsLayer) {
      this.map.removeLayer(this.cardsLayer);
    }

    if(this.props.mode !== 'quality') return;

    const style = {
      color: '#000',
      fillColor: '#aaa',
      fillOpacity: 0.5,
      weight: 0.2
    };

    const cardsLayer = L.geoJson(this.props.cards, {
      style: (feature) => {
        const quality = _.findWhere(this.props.qualities, { name: feature.properties.name });

        if(quality) {
          return {
            ...style,
            fillColor: _.findWhere(this.props.qualityInfo, { api_name: String(quality.quality) }).color
          };
        } else {
          return style;
        }
      }
    }).addTo(this.map);

    this.cardsLayer = cardsLayer;
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.qualities, nextProps.qualities)) {
      this.setQualityLayer();
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.territory.id != this.props.territory.id) {
      this.fitTerritory();
    }

    if(!_.isEqual(this.props, prevProps)) {
      this.dataLayer.setOpacity(this.props.opacity);
      this.setBaseMapsOpacity();
      this.setLayersOpacity();
      this.setQualityLayer();

      if(!_.isEqual(this.props.layerOptions, prevProps.layerOptions)) {
        this.dataLayer.setParams(this.options);
      }

      if(!_.isEqual(this.props.year, prevProps.year)) {
        this.updateWmsMaps();
      }
    }
  }

  componentDidMount() {
    this.setup();
  }

  render() {
    return (
      <div className="map__canvas" ref="element"></div>
    );
  }
}
