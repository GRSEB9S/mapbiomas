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
              {...this.props}
              onChange={this.onChangeClassifications.bind(this)}
            />
          </div>
          <div className="map-control-wrapper">
            <CoverageControl
              {...this.props}
              setMode={this.setMode.bind(this, 'transition')}
            />
          </div>
          <div className="timeline-control-wrapper">
            <div className="timeline-control">
              <ReactTimelineSlider range={[2010, 2011, 2012]}/>
            </div>
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
                {I18n.t('map.index.transitions_analysis')}
              </h3>
              <div className="map-control__content">
                <label>{I18n.t('map.index.search')}</label>
                <input type="text" />
                <button className="primary" onClick={this.setMode.bind(this, 'coverage')}>
                  {I18n.t('map.index.coverage_analysis')}
                </button>
                <button>
                  {I18n.t('map.index.download')}
                </button>
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
}
