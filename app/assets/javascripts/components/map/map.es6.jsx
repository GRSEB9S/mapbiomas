class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificatios: [],
      mode: 'coverage',
      year: null,
      years: [],
      territory: null
    };
  }

  //Props
  get classifications() {
    return this.state.classifications || this.props.defaultClassifications;
  }

  get territory() {
    return this.state.territory || this.props.defaultTerritory;
  }

  get url() {
    let ids = this.classifications.map((c) => c.id);
    let url = 'https://{s}.tiles.mapbox.com/v3/mpivaa.kgcn043g/{z}/{x}/{y}.png'
    let year = this.state.mode == 'coverage' ? this.year : this.years.join(',');
    return (`${url}?year=${year}&classification_ids=${ids.join(',')}`);
  }

  get year() {
    return this.state.year || this.props.defaultYear;
  }

  get years() {
    if(this.state.years.length == 2) {
      return this.state.years;
    } else {
      return [2010, 2014];
    }
  }

  //Handlers
  handleTerritoryChange(id) {
    let territory = this.props.availableTerritories.find((t) => t.id == id);
    this.setState({ territory: territory })
  }

  handleYearChange(v) {
    this.setState({ year: v, years: v });
  }

  handleClassificationsChange(ids) {
    let classifications = ids.map((id) => {
      return this.props.availableClassifications.find((c) => c.id === id);
    })

    this.setState({ classifications: classifications });
  }

  setMode(mode) {
    this.setState({ mode: mode });
  }

  render() {
    if(this.state.mode == 'coverage') {
      return (
        <div className="map">
          <MapCanvas url={this.url} territory={this.territory}/>
          <div className="map-control-wrapper map-control-wrapper--left map-control-wrapper--bottom">
            <ClassificationsControl
              {...this.props}
              classifications={this.classifications}
              onChange={this.handleClassificationsChange.bind(this)}
            />
          </div>
          <div className="map-control-wrapper">
            <CoverageControl
              {...this.props}
              territory={this.territory}
              year={this.year}
              classifications={this.classifications}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
              setMode={this.setMode.bind(this, 'transition')}
            />
          </div>
          <div className="timeline-control">
            <ReactTimelineSlider
              onValueChange={this.handleYearChange.bind(this)}
              range={[2010, 2011, 2012, 2013, 2014, 2015]} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="map">
          <MapCanvas url={this.url} />
          <div className="map-control-wrapper">
            <TransitionsControl
              {...this.props}
              territory={this.territory}
              years={this.years}
              classifications={this.classifications}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
              setMode={this.setMode.bind(this, 'coverage')}
            />
          </div>
          <div className="timeline-control">
            <ReactTimelineSlider
              multi={true}
              onValueChange={this.handleYearChange.bind(this)}
              range={[2010, 2011, 2012, 2013, 2014, 2015]} />
          </div>
        </div>
      );
    }
  }
}
