class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificatios: [],
      mode: 'coverage',
      year: null,
      years: [],
      territory: null,
      transition: null,
      transitions: [],
      transitionsMatrixExpanded: false,
      showWarning: true
    };
  }

  //Props
  get classifications() {
    return this.state.classifications || this.props.defaultClassifications;
  }

  get territory() {
    return this.state.territory || this.props.defaultTerritory;
  }

  get transition() {
    return this.state.transition || this.state.transitions[0];
  }

  get urlpath() {
    switch(this.state.mode) {
      case 'coverage':
        return "wms/classification/coverage.map";
      case 'transitions':
        return "wms/classification/transitions.map";
      default:
        return "wms/classification/coverage.map";
    }
  }

  get tileOptions() {
    let ids = this.classifications.map((c) => c.id);
    let year = this.state.mode == 'coverage' ? this.year : this.years.join(',');
    let transitionId
    if(this.transition) {
      transitionId = `${this.transition.from}${this.transition.to}`;
    }
    return {
      layers: this.state.mode,
      url: this.props.url,
      map: this.urlpath,
      year: year,
      territory_id: this.territory.id,
      transition_id: transitionId,
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

  get territories() {
    return this.props.availableTerritories.map((t) => {
      return {
        id: t.id,
        name: `${t.name} (${t.category})`
      };
    });
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
    this.setState({ transition: transition });
  }

  handleTransitionsLoad(transitions) {
    this.setState({ transitions: transitions, transition: transitions[0]})
  }

  setMode(mode) {
    this.setState({ mode: mode, year: null, years: [],
                  transitions: [], transitionsMatrixExpanded: false });
  }

  totalClassificationData(arr, from, to) {
    return {
      area: _.reduce(arr, (memo, num) => {
          return memo + parseFloat(num.area);
        }, 0
      ),
      from: from,
      percentage: _.reduce(arr, (memo, num) => {
          return memo + parseFloat(num.percentage);
        }, 0
      ),
      to: to
    }
  }

  toTotalData() {
    let transitions = this.state.transitions;
    let totalClassificationId = _.last(this.props.defaultClassifications).id + 1;

    return this.props.defaultClassifications.map((element) => {
      let toTransitions = _.where(transitions, {to: element.id});
      let fromToTotalToClassification = this.totalClassificationData(
        toTransitions,
        totalClassificationId,
        element.id
      );

      return fromToTotalToClassification;
    });
  }

  fromTotalData() {
    let transitions = this.state.transitions;
    let totalClassificationId = _.last(this.props.defaultClassifications).id + 1;

    return this.props.defaultClassifications.map((element) => {
      let fromTransitions = _.where(transitions, {from: element.id});
      let fromClassificationToTotal = this.totalClassificationData(
        fromTransitions,
        element.id,
        totalClassificationId
      );

      return fromClassificationToTotal;
    });
  }

  expandTransitionsMatrix(transitions) {
    this.setState({
      transitionsMatrixExpanded: true
    });
  }

  closeTransitionsMatrix() {
    this.setState({
      transitionsMatrixExpanded: false }
    );
  }

  renderTransitionsMatrix() {
    if(this.state.transitionsMatrixExpanded) {
      return (
        <MapModal title={I18n.t('map.index.transitions_matrix.title')}
          showCloseButton={true}
          showOkButton={false}
          onClose={this.closeTransitionsMatrix.bind(this)}
          verticalSmaller={true}
          overlay={true}>
          <TransitionsMatrix
            years={this.years}
            transitions={this.state.transitions}
            classifications={this.classifications}
            toTotalData={this.toTotalData()}
            fromTotalData={this.fromTotalData()} />
        </MapModal>
      );
    }
  }

  render() {
    if(this.state.showWarning) {
      //TODO
      var warning = (
        <MapModal title={I18n.t('map.warning.title')}
          showCloseButton={false}
          showOkButton={true}
          verticalSmaller={true}
          horizontalSmaller={true}
          overlay={true}
          onClose={() => {
            this.setState({ showWarning: false });
          }}>
        <div dangerouslySetInnerHTML={{__html: I18n.t('map.warning.body')}}></div>
        </MapModal>
      );
    }
    if(this.state.mode == 'coverage') {
      return (
        <div className="map">
          {warning}
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
              availableTerritories={this.territories}
              territory={this.territory}
              year={this.year}
              classifications={this.classifications}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
              setMode={this.setMode.bind(this, 'transitions')}
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
          {warning}
          <MapCanvas {...this.tileOptions} territory={this.territory} />
          <div className="map-control-wrapper">
            <TransitionsControl
              {...this.props}
              availableTerritories={this.territories}
              transition={this.transition}
              transitions={this.state.transitions}
              classifications={this.classifications}
              territory={this.territory}
              years={this.years}
              onExpandMatrix={this.expandTransitionsMatrix.bind(this)}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
              onTransitionsLoad={this.handleTransitionsLoad.bind(this)}
              setTransition={this.handleTransitionChange.bind(this)}
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
