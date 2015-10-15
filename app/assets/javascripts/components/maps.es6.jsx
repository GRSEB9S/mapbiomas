class Map extends React.Component {
  constructor(props) {
    let defaultOptions = {
      maxZoom: 6,
      minZoom: 2,
    };

    props.options = _.defaults({}, props.options, defaultOptions);

    super(props)
  }

  setup() {
    let size = [8000, 8485];

    this.map = new L.map(React.findDOMNode(this.refs.element),
                                           this.props.options);
    let bounds = new L.LatLngBounds(
      this.map.unproject([0, size[1]], this.props.options.maxZoom),
      this.map.unproject([size[0], 0], this.props.options.maxZoom)
    );
    let url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';

    this.map.fitBounds(bounds);
    L.tileLayer(url).addTo(this.map);
  }

  componentDidMount() {
    this.setup();
  }

  render() {
    return (
      <div className="map">
        <div className="map__element" ref="element"></div>
      </div>
    );
  }
}
