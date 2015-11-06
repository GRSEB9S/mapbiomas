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
    let ids = this.classifications.map((c) => c.id);
    let url = 'https://{s}.tiles.mapbox.com/v3/mpivaa.kgcn043g/{z}/{x}/{y}.png'
    let year = this.state.mode == 'coverage' ? this.year : this.years.join(',');
    return (`${url}?year=${year}&classification_ids=${ids.join(',')}`);
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

  setMode(mode) {
    this.setState({ mode: mode, year: null, years: [],
                  transitions: [], transitionsMatrixExpanded: false });
  }

  totalClassificationData(arr, from, to) {
    return {
      area: _.reduce(arr, function(memo, num){
          return memo + num.area;
        }, 0
      ),
      from: from,
      percentage: _.reduce(arr, function(memo, num){
          return memo + num.percentage;
        }, 0
      ),
      to: to
    }
  }

  expandTransitionsMatrix(transitions) {
    let totalClassificationId = _.last(this.props.defaultClassifications).id + 1;
    let transitionsMatrix = _.clone(transitions);

    this.props.defaultClassifications.forEach((element) => {
      let fromTransitions = _.where(transitions, {from: element.id});
      let fromClassificationToTotal = this.totalClassificationData(fromTransitions, element.id, totalClassificationId);
      transitionsMatrix.push(fromClassificationToTotal);

      let toTransitions = _.where(transitions, {to: element.id});
      let fromToTotalToClassification = this.totalClassificationData(toTransitions, totalClassificationId, element.id);
      transitionsMatrix.push(fromToTotalToClassification);
    });

    this.setState({ transitionsMatrix: transitionsMatrix, transitionsMatrixExpanded: true });
  }

  closeTransitionsMatrix() {
    this.setState({ transitions: [], transitionsMatrixExpanded: false });
  }

  componentDidMount() {
    let totalClassificationId = _.last(this.props.defaultClassifications).id + 1;
    let classifications = _.clone(this.classifications);
    let total = {
                  id: totalClassificationId,
                  name: I18n.t('map.index.transitions_matrix.total'),
                  color: "#000000"
                };

    classifications.push(total);
    this.setState({ matrixClassifications: classifications });
  }

  renderTransitionsMatrix() {
    if(this.state.transitionsMatrixExpanded) {
      return (
        <MapModal title={I18n.t('map.index.transitions_matrix.title')}
          onClose={this.closeTransitionsMatrix.bind(this)}>
          <TransitionsMatrix
            years={this.years}
            transitions={this.state.transitionsMatrix}
            classifications={this.state.matrixClassifications} />
        </MapModal>
      );
    }
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
              territory={this.territory}
              years={this.years}
              onExpandMatrix={this.expandTransitionsMatrix.bind(this)}
              classifications={this.state.matrixClassifications}
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
