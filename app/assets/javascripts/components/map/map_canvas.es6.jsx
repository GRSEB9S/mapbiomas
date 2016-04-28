class MapCanvas extends React.Component {
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

  loadCards() {
    $.getJSON("https://s3.amazonaws.com/mapbiomas-ecostage/cartas_ibge_250000.geojson", (cards) => {
      this.setState({
        cards,
      }, () => {
        this.setQualityLayer();
      });
    });
  }

  addBaseMaps(map) {
    _.each(this.props.baseMaps, (baseMap) => {
      let newMap = L.tileLayer(baseMap.link, {
        attribution: baseMap.attribution
      }).addTo(this.map);

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
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(this.map);

    this.loadCards();
    this.addBaseMaps(this.map);
    this.addLayers(this.map);

    this.dataLayer = L.tileLayer.wms(
      `${this.options.url}/cgi-bin/mapserv`,
      this.options
    ).addTo(this.map);

    this.fitTerritory();
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
      weight: 0.2
    };

    const cardsLayer = L.geoJson(this.state.cards, {
      style: (feature) => {
        const quality = _.findWhere(this.props.qualities, { name: feature.properties.name });
        if(quality) {
          switch(quality.quality) {
            case 1: return { ...style, fillColor: '#008800' };
            case 2: return { ...style, fillColor: '#FCF35B' };
            case 3: return { ...style, fillColor: '#880000' };
            default: return style;
          }
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
