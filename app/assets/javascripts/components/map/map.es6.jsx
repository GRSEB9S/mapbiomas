class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainMenuIndex: 0,
      viewOptionsIndex: 0,
      opacity: 0.6,
      classifications: null,
      baseMaps: null,
      layers: null,
      cards: null,
      qualities: [],
      year: null,
      years: [],
      territory: null,
      transition: null,
      transitions: [],
      transitionsMatrixExpanded: false,
      showWarning: true,
    };
  }

  //Props
  get classifications() {
    return this.state.classifications || this.props.defaultClassifications;
  }

  get baseMaps() {
    return this.state.baseMaps || this.props.defaultBaseMaps;
  }

  get layers() {
    return this.state.layers || this.props.defaultLayers;
  }

  get territory() {
    return this.state.territory || this.props.defaultTerritory;
  }

  get transition() {
    return this.state.transition || this.state.transitions[0];
  }

  get mode() {
    let modes = ['coverage', 'transitions', 'quality'];

    return modes[this.state.mainMenuIndex];
  }

  get urlpath() {
    switch(this.mode) {
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
      let availableYears =_.sortBy(this.props.availableYears, (year) => {
        return year;
      })

      return _.last(availableYears, 2)
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

  handleBaseMapsChange(ids) {
    let baseMaps = ids.map((id) => {
      return this.props.availableBaseMaps.find((c) => c.id === id);
    })

    this.setState({ baseMaps });
  }

  handleLayersChange(ids) {
    let layers = ids.map((id) => {
      return this.props.availableLayers.find((c) => c.id === id);
    })

    this.setState({ layers });
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

  handleMainMenuIndexSelect(index) {
    this.setState({ mainMenuIndex: index });
  }

  handleViewOptionsIndexSelect(index) {
    this.setState({ viewOptionsIndex: index });
  }

  isMulti() {
    return this.mode == 'transitions';
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

  loadQualities() {
    API.qualities({year: this.state.year})
    .then((qualities) => {
      this.setState({ qualities });
    });
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

  renderCoverageAuxiliarControls() {
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

          <ReactTabs.Tabs
              selectedIndex={this.state.viewOptionsIndex}
              onSelect={this.handleViewOptionsIndexSelect.bind(this)}>

            <ReactTabs.TabList className="tab-triple">
              <ReactTabs.Tab>{I18n.t('map.index.classifications')}</ReactTabs.Tab>
              <ReactTabs.Tab>{I18n.t('map.index.base_maps.title')}</ReactTabs.Tab>
              <ReactTabs.Tab>{I18n.t('map.index.layers.title')}</ReactTabs.Tab>
            </ReactTabs.TabList>

            <ReactTabs.TabPanel>
              <TogglesControl
                options={this.classifications}
                availableOptions={this.props.availableClassifications}
                title={I18n.t('map.index.classifications')}
                tooltip={I18n.t('map.tooltip')}
                onChange={this.handleClassificationsChange.bind(this)}
              />
            </ReactTabs.TabPanel>

            <ReactTabs.TabPanel>
              <TogglesControl
                options={this.baseMaps}
                availableOptions={this.props.availableBaseMaps}
                title={I18n.t('map.index.base_maps.title')}
                onChange={this.handleBaseMapsChange.bind(this)}
              />
            </ReactTabs.TabPanel>

            <ReactTabs.TabPanel>
              <TogglesControl
                options={this.layers}
                availableOptions={this.props.availableLayers}
                title={I18n.t('map.index.layers.title')}
                onChange={this.handleLayersChange.bind(this)}
              />
            </ReactTabs.TabPanel>
          </ReactTabs.Tabs>
        </div>
      );
    }
  }

  renderMainMenu() {
    return(
      <ReactTabs.Tabs
          selectedIndex={this.state.mainMenuIndex}
          onSelect={this.handleMainMenuIndexSelect.bind(this)}
          className="map-control-wrapper">

        <ReactTabs.TabList className="tab-triple">
          <ReactTabs.Tab>{I18n.t('map.index.coverage')}</ReactTabs.Tab>
          <ReactTabs.Tab>{I18n.t('map.index.transitions')}</ReactTabs.Tab>
          <ReactTabs.Tab>{I18n.t('map.index.quality')}</ReactTabs.Tab>
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

        <ReactTabs.TabPanel>
          <QualityControl
            {...this.props}
            availableTerritories={this.territories}
            territory={this.territory}
            year={this.year}
            classifications={this.classifications}
            onTerritoryChange={this.handleTerritoryChange.bind(this)}
          />
        </ReactTabs.TabPanel>
      </ReactTabs.Tabs>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.year != nextState.year || this.mode == 'quality') {
      this.loadQualities();
    }
  }

  render() {
    return (
      <div className="map">
        {this.renderWarning()}

        <MapCanvas
          {...this.tileOptions}
          baseMaps={this.props.availableBaseMaps}
          selectedBaseMaps={this.state.baseMaps}
          mode={this.mode}
          territory={this.territory}
          layers={this.props.availableLayers}
          selectedLayers={this.state.layers}
          qualities={this.state.qualities}
        />

        {this.renderCoverageAuxiliarControls()}
        {this.renderMainMenu()}
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
