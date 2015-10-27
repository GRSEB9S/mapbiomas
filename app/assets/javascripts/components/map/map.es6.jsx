class Map extends React.Component {
  onChangeClassifications(ids) {
    console.log(ids);
  }

  render() {
    return (
      <div className="map">
        <MapCanvas />
        <div className="map-control-wrapper left">
          <ClassificationsControl
            classifications={this.props.classifications}
            defaultChecked={this.props.defaultClassifications}
            onChange={this.onChangeClassifications.bind(this)}
          />
        </div>
        <div className="map-control-wrapper">
          <div className="map-control">
            <h3 className="map-control__header">
              Análise de cobertura
            </h3>
            <div className="map-control__content">
              <label>busque uma cidade, estado, areas protegidas, biomas, etc...</label>
              <input type="text" />
              <button className="primary">Analisar</button>
              <button>Analisar</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
