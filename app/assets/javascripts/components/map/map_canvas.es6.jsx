class MapCanvas extends React.Component {
  get options() {
    let defaultOptions = {
        format: 'image/png',
        transparent: true,
        attribution: "MapBiomas Workspace"
    }
    return _.defaults({}, this.props, defaultOptions);
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node).setView([-20, -45], 6);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.layer =L.tileLayer.wms(
      `${this.props.url}/cgi-bin/mapserv`,
      this.options
    ).addTo(this.map);

    this.fitTerritory();
  }

  fitTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.territory.id != this.props.territory.id) {
      this.fitTerritory();
    }
    this.layer.setParams(this.options);
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
