class Map extends React.Component {
  get layersControlProps() {
    return {
    };
  }

  render() {
    return (
      <div className="map">
        <MapCanvas />
        <div className="map-control-wrapper left">
          <div className="map-control">
            <h3 className="map-control__header">
              Camadas
            </h3>
            <div className="map-control__content">
            </div>
          </div>
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
