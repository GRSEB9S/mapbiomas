class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      opacity: 0.6,
      classificatios: [],
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

  get mode() {
    let modes = ['coverage', 'transitions', 'quality'];

    return modes[this.state.index];
  }

  get urlpath() {
    switch(this.mode) {
      case 'coverage':
        return "wms-b/classification/coverage.map";
      case 'transitions':
        return "wms-b/classification/transitions.map";
      default:
        return "wms-b/classification/coverage.map";
    }
  }

  get tileOptions() {
    let ids = this.classifications.map((c) => c.id);
    let year = this.mode == 'coverage' ? this.year : this.years.join(',');
    let transitionId
    if(this.transition) {
      transitionId = `${this.transition.from}${this.transition.to}`;
    }
    return {
      layerOptions: {
        layers: this.mode,
        url: this.props.url,
        map: this.urlpath,
        year: year,
        territory_id: this.territory.id,
        transition_id: transitionId,
        classification_ids: ids.join(','),
      },
      opacity: this.state.opacity
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

    this.setState({ classifications });
  }

  handleTransitionChange(transition) {
    this.setState({ transition });
  }

  handleTransitionsLoad(transitions) {
    this.setState({ transitions, transition: transitions[0]})
  }

  handleOpacityChange(e) {
    const opacity = e.target.value / 100;
    this.setState({ opacity });
  }

  handleIndexSelect(index) {
    this.setState({ index: index });
  }

  isMulti() {
    return !(this.mode == 'coverage');
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

  closeWarning() {
    this.setState({ showWarning: false });
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

  renderWarning() {
    if(this.state.showWarning) {
      return(
        <MapModal title={I18n.t('map.warning.title')}
          showCloseButton={false}
          showOkButton={true}
          verticalSmaller={true}
          horizontalSmaller={true}
          overlay={true}
          onClose={this.closeWarning.bind(this)}>

          <div dangerouslySetInnerHTML={{__html: I18n.t('map.warning.body')}}></div>
        </MapModal>
      );
    }
  }

  renderAuxiliarControls() {
    if(this.mode == 'coverage') {
      return(
        <div className="map-control-wrapper
            map-control-wrapper--smaller
            map-control-wrapper--left
            map-control-wrapper--bottom">
          <OpacityControl
            {...this.props}
            opacity={this.state.opacity*100}
            onChange={this.handleOpacityChange.bind(this)} />
          <ClassificationsControl
            {...this.props}
            classifications={this.classifications}
            onChange={this.handleClassificationsChange.bind(this)}
          />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="map">
        {this.renderWarning()}

        <MapCanvas {...this.tileOptions} territory={this.territory}/>

        {this.renderAuxiliarControls()}

        <ReactTabs.Tabs
            selectedIndex={this.state.index}
            onSelect={this.handleIndexSelect.bind(this)}
            className="map-control-wrapper">
          <ReactTabs.TabList >
            <ReactTabs.Tab>{I18n.t('map.index.coverage')}</ReactTabs.Tab>
            <ReactTabs.Tab>{I18n.t('map.index.transitions')}</ReactTabs.Tab>
            <ReactTabs.Tab disabled={true}>{I18n.t('map.index.quality')}</ReactTabs.Tab>
          </ReactTabs.TabList>

          <ReactTabs.TabPanel>
            <CoverageControl
              {...this.props}
              availableTerritories={this.territories}
              territory={this.territory}
              year={this.year}
              classifications={this.classifications}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
            />
          </ReactTabs.TabPanel>

          <ReactTabs.TabPanel>
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
            />
          </ReactTabs.TabPanel>

          <ReactTabs.TabPanel></ReactTabs.TabPanel>
        </ReactTabs.Tabs>

        {this.renderTransitionsMatrix()}

        <div className="timeline-control">
          <ReactTimelineSlider
            multi={this.isMulti()}
            playStop={true}
            onValueChange={this.handleYearChange.bind(this)}
            range={this.props.availableYears} />
        </div>
      </div>
    );
  }
}
