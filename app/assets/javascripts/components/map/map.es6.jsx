class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificatios: [],
      mode: 'coverage'
    };
  }

  onChangeClassifications(ids) {
    this.setState({ classifications: ids });
  }

  setMode(mode) {
    this.setState({ mode: mode });
  }

  get url() {
    let ids = this.state.classifications || this.props.defaultClassifications;
    let url = 'https://{s}.tiles.mapbox.com/v3/mpivaa.kgcn043g/{z}/{x}/{y}.png'
    return (`${url}?classification_ids=${ids.join(',')}`);
  }

  render() {
    if(this.state.mode == 'coverage') {
      return (
        <div className="map">
          <MapCanvas url={this.url} />
          <div className="map-control-wrapper left">
            <ClassificationsControl
              classifications={this.props.classifications}
              defaultClassifications={this.props.defaultClassifications}
              onChange={this.onChangeClassifications.bind(this)}
            />
          </div>
          <div className="map-control-wrapper">
            <CoverageControl
              classifications={this.props.classifications}
              defaultTerritory={this.props.defaultTerritory}
              territories={this.props.territories}
              setMode={this.setMode.bind(this, 'transition')}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="map">
          <MapCanvas url={this.url} />
          <div className="map-control-wrapper">
            <div className="map-control">
              <h3 className="map-control__header">
                Análise de transição
              </h3>
              <div className="map-control__content">
                <label>busque uma cidade, estado, areas protegidas, biomas, etc...</label>
                <input type="text" />
                <button className="primary" onClick={this.setMode.bind(this, 'coverage')}>
                  Analise de cobertura
                </button>
                <button>Baixe os dados</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
