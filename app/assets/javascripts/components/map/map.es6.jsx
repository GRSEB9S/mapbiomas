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
              {I18n.t('map.index.classifications')}
            </h3>
            <div className="map-control__content">
            </div>
          </div>
        </div>
        <div className="map-control-wrapper">
          <div className="map-control">
            <h3 className="map-control__header">
              {I18n.t('map.index.coverage_analysis')}
            </h3>
            <div className="map-control__content">
              <label>{I18n.t('map.index.search')}</label>
              <input type="text" />
              <button className="primary">{I18n.t('map.index.analyze')}</button>
              <button>{I18n.t('map.index.analyze')}</button>
            </div>
          </div>
        </div>
        <div className="timeline-control-wrapper">
          <div className="timeline-control">
            <ReactTimelineSlider range={[2010, 2011, 2012]}/>
          </div>
        </div>
      </div>
    );
  }
}
