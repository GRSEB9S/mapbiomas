class MapCanvas extends React.Component {
  constructor() {
    super();

    this.layers = {};
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

  get layersSlugs() {
    return _.map(this.props.selectedLayers, (layer) => {
      return layer.slug;
    });
  }

  addLayers(map) {
    _.each(this.props.layers, (layer) => {
      cartodb.createLayer(map, layer.link)
        .addTo(map)
        .done((mapLayer) => {
          this.layers[layer.slug] = mapLayer;
          mapLayer.setOpacity(0);
        })
    });
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node).setView([-20, -45], 6);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    }).addTo(this.map);

    this.addLayers(this.map);

    this.dataLayer = L.tileLayer.wms(
      `${this.options.url}/cgi-bin/mapserv`,
      this.options
    ).addTo(this.map);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png')
      .addTo(this.map);

    this.fitTerritory();
  }

  fitTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
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

  componentDidUpdate(prevProps) {
    if(prevProps.territory.id != this.props.territory.id) {
      this.fitTerritory();
    }

    if(!_.isEqual(this.props, prevProps)) {
      this.dataLayer.setOpacity(this.props.opacity);
      this.setLayersOpacity();

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
