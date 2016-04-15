class MapCanvas extends React.Component {
  constructor() {
    super();

    this.layers = {};
    this.layersLinks = {
      states: 'https://karydja.cartodb.com/api/v2/viz/4dd47a54-01a8-11e6-86a9-0e31c9be1b51/viz.json',
      cities: 'https://karydja.cartodb.com/api/v2/viz/72b94172-0263-11e6-a087-0e5db1731f59/viz.json',
      contourMaps: 'https://karydja.cartodb.com/api/v2/viz/1413c17c-0274-11e6-ae17-0e787de82d45/viz.json',
      biomes: 'https://karydja.cartodb.com/api/v2/viz/201bcb2a-026c-11e6-9f9a-0e3ff518bd15/viz.json'
    }
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

  addLayers(map) {
    _.each(this.layersLinks, (link, key) => {
      cartodb.createLayer(map, link)
        .addTo(map)
        .done((layer) => {
          this.layers[key] = layer;
          layer.setOpacity(0);
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
    _.each(this.props.layers, (value, key) => {
      if(value) {
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
