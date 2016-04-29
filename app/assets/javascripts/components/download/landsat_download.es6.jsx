class LandsatDownload extends React.Component {
  constructor() {
    super();
  }

  addBaseMap(map) {
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);
  }

  setCardsLayer(cards, map) {
    const style = {
      color: '#000',
      fillColor: '#aaa',
      weight: 0.3
    };

    L.geoJson(cards, {
      style: style
    }).addTo(map);
  }

  addCardsLayer(map) {
    $.getJSON("https://s3.amazonaws.com/mapbiomas-ecostage/cartas_ibge_250000.geojson", (cards) => {
      this.setState({ cards }, () => {
        this.setCardsLayer(cards, map);
      });
    });
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node, {
      minZoom: 4
    }).setView([-15, -57], 4);

    this.addBaseMap(this.map);
    this.addCardsLayer(this.map);
  }

  componentDidMount() {
    this.setup();
  }

  render() {
    return (
      <div className="landsat-download">
        <div className="map__canvas" ref="element"></div>
      </div>
    );
  }
}
