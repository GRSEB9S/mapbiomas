class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificatios: [],
      mode: 'coverage',
      year: null,
      years: [],
      territory: null,
      transitions: [],
      transitionsMatrixExpanded: false
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
    switch(this.state.mode) {
      case 'coverage':
        return "wms/classification/coverage.map";
      default:
        return "wms/classification/coverage.map";
    }
  }

  get tileOptions() {
    let ids = this.classifications.map((c) => c.id);
    let year = this.state.mode == 'coverage' ? this.year : this.years.join(',');
    return {
      layers: this.state.mode,
      map: this.url,
      year: year,
      territory_id: this.territory.id,
      classification_ids: ids.join(','),
    };
  }

  get year() {
    return this.state.year || this.props.availableYears[this.props.availableYears.length-1];
  }

  get years() {
    if(this.state.years.length == 2) {
      return this.state.years;
    } else {
      let min = Math.min.apply(Math, this.props.availableYears);
      let max = Math.max.apply(Math, this.props.availableYears);

      return [min, max];
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

  handleTransitionChange(transition) {
    this.setState( { transition: transition });
  }

  setMode(mode) {
    this.setState({ mode: mode, year: null, years: [],
                  transitions: [], transitionsMatrixExpanded: false });
  }

  expandTransitionsMatrix(transitions) {
    this.setState({ transitions: transitions, transitionsMatrixExpanded: true });
  }

  closeTransitionsMatrix() {
    this.setState({ transitions: [], transitionsMatrixExpanded: false });
  }

  renderTransitionsMatrix() {
    if(this.state.transitionsMatrixExpanded) {
      return (
        <MapModal title={I18n.t('map.index.transitions_matrix')}
          onClose={this.closeTransitionsMatrix.bind(this)}>
          <TransitionsMatrix 
            years={this.years}
            transitions={this.state.transitions}
            classifications={this.classifications} />
        </MapModal>
      );
    }
  }

  render() {
    if(this.state.mode == 'coverage') {
      return (
        <div className="map">
          <MapCanvas {...this.tileOptions} territory={this.territory}/>
          <div className="map-control-wrapper
              map-control-wrapper--smaller
              map-control-wrapper--left
              map-control-wrapper--bottom">
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
              playStop={true}
              onValueChange={this.handleYearChange.bind(this)}
              range={this.props.availableYears} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="map">
          <MapCanvas url={this.url} territory={this.territory} />
          <div className="map-control-wrapper">
            <TransitionsControl
              {...this.props}
              transition={this.state.transition}
              setTransition={this.handleTransitionChange.bind(this)}
              territory={this.territory}
              years={this.years}
              onExpandMatrix={this.expandTransitionsMatrix.bind(this)}
              classifications={this.classifications}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
              setMode={this.setMode.bind(this, 'coverage')}
            />
          </div>
          <div className="timeline-control">
            <ReactTimelineSlider
              multi={true}
              playStop={true}
              onValueChange={this.handleYearChange.bind(this)}
              range={this.props.availableYears} />
          </div>

          {this.renderTransitionsMatrix()}
        </div>
      );
    }
  }
}
