import React from 'react';
import _ from 'underscore';
import Select from 'react-select-plus';
import classNames from 'classnames';
import { API } from '../../lib/api';
import { MapCanvas } from '../map/map_canvas';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Territories } from '../../lib/territories';

import TransitionsMatrixModal from './modals/transitions_matrix';
import WarningModal from './modals/warning';
import ZoomAndOpacityPanel from './panels/zoom_and_opacity';
import TerritoryPanel from './panels/territory';
import CoverageAuxiliarControls from './panels/coverage_auxiliar_controls';
import MainMenu from './panels/main_menu';
import QualityLabels from './panels/quality_labels';
import CoveragePieChart from '../control/coverage_pie_chart';
import QualityChart from '../control/quality_chart';
import TransitionsControl from '../control/transitions/transitions_control';
import YearControl from './panels/year_control';

Tabs.setUseDefaultStyles(false);

const DENSE_FOREST_ID = 3;

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: location.hash.replace('#', '') || 'coverage',
      viewOptionsIndex: 0,
      opacity: 0.6,
      classifications: null,
      baseMaps: null,
      layers: null,
      qualities: [],
      year: null,
      years: [],
      territory: null,
      transition: null,
      transitions: [],
      transitionsMatrixExpanded: false,
      showWarning: {
        coverage: true,
        transitions: true,
        quality: true
      }
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
    if(_.isEmpty(this.state.territory)) {
      let defaultTerritory = new Territories([this.props.defaultTerritory]).withOptions();

      return _.first(defaultTerritory);
    } else {
      return this.state.territory;
    }
  }

  get transition() {
    return this.state.transition || this.state.transitions[0];
  }

  get mode() {
    // let modes = ['coverage', 'transitions', 'quality'];

    // return modes[this.state.mainMenuIndex];
    return this.state.mode;
  }

  get urlpath() {
    switch(this.mode) {
      case 'transitions':
        return 'wms-c2/classification/transitions.map';
      default:
        return 'wms-c2/classification/coverage.map';
    }
  }

  get transitionsOptions() {
    let fromId, toId;

    if(this.state.transition) {
      fromId = this.state.transition.from;
      toId = this.state.transition.to;
    }

    return {
      layerOptions: {
        layers: 'transitions',
        map: "wms-c2/classification/transitions.map",
        territory_id: this.territory.id,
        year_t0: this.years[0],
        year_t1: this.years[1],
        transition_c0: fromId || DENSE_FOREST_ID,
        transition_c1: toId || DENSE_FOREST_ID,
        format: 'image/png',
        transparent: true
      }
    }
  }

  get tileOptions() {
    let ids = this.classifications.map((c) => c.id);
    let year = this.mode == 'coverage' ? this.year : this.years.join(',');
    let transitionId;

    if(this.mode == 'transitions') {
      return this.transitionsOptions;
    }

    if(this.state.transition) {
      transitionId = `${this.state.transition.from}${this.state.transition.to}`;
    }

    return {
      layerOptions: {
        layers: this.mode,
        url: this.props.apiUrl,
        map: this.urlpath,
        year: year,
        territory_id: this.territory.id,
        transition_id: transitionId || '11',
        classification_ids: ids,
      },
      opacity: this.state.opacity
    };
  }

  get year() {
    return this.state.year || this.lastAvailableYears();
  }

  get years() {
    if(_.isEmpty(this.state.years)) {
      return this.lastAvailableYears(2);
    } else {
      return this.state.years
    }
  }

  lastAvailableYears(limit = null) {
    let availableYears =_.sortBy(this.props.availableYears, (year) => {
      return year;
    })

    return _.last(availableYears, limit)
  }

  //Handlers
  handleModeChange(mode) {
    this.setState({ mode });
    window.location.hash = `#${mode}`;
  }

  handleTerritoryChange(territory) {
    this.setState({ territory })
  }

  handleYearChange(newYear) {
    if(newYear instanceof Array) {
      this.setState({ years: newYear });
    } else {
      this.setState({ year: newYear });
      this.loadQualities(newYear);
    }
  }

  handleClassificationsChange(ids) {
    this.setState({
      classifications: ids.map((id) => (
        this.props.availableClassifications.find((c) => c.id === id)
      ))
    });
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
    this.setState({
      transition: transition,
      transitionsMatrixExpanded: false
    });
  }

  handleTransitionsLoad(transitions) {
    this.setState({ transitions });
  }

  setOpacity(opacity) {
    this.setState({ opacity });
  }

  handleMainMenuIndexSelect(index) {
    this.setState({ mainMenuIndex: index });
  }

  handleViewOptionsIndexSelect(index) {
    this.setState({ viewOptionsIndex: index });
  }

  handleTransitionsPeriodChange(period) {
    this.setState({ years: period.value });
  }

  timelineDefaultValue() {
    if(this.mode == 'transitions') {
      return this.years;
    } else {
      return [this.year];
    }
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

  downloadSpreadsheet() {
    let params = {
      territory_id: this.territory.id,
      territory_name: this.territory.name,
      year: this.years.join(',')
    };
    return Routes.download_path(params);
  }

  closeWarning(key) {
    let state = _.clone(this.state);
    state.showWarning[key] = false;

    this.setState(state);
  }

  loadCards() {
    $.getJSON(this.props.qualityCardsUrl, (cards) => {
      this.setState({ cards });
    });
  }

  loadQualities(year) {
    API.qualities({year: year})
    .then((qualities) => {
      return _.map(qualities, (q) => {
        return {
          ...q,
          name: q.chart
        };
      });
    })
    .then((qualities) => {
      this.setState({ qualities });
    });
  }

  loadTerritories(category, preload) {
    return (input, callback) => {
      clearTimeout(this.timeoutId);

      if (input || preload === true) {
        this.timeoutId = setTimeout(() => {
          API.territories({
            category,
            name: input.toUpperCase()
          })
          .then((territories) => {
            callback(null, {
              options: new Territories(territories).withOptions()
            });
          });
        }, 500);
      } else {
        callback(null, { options: [] });
      }
    };
  }

  renderTransitionsMatrix() {
    if(this.state.transitionsMatrixExpanded) {
      return (
        <TransitionsMatrixModal
          setTransition={this.handleTransitionChange.bind(this)}
          onClose={this.closeTransitionsMatrix.bind(this)}
          years={this.years}
          downloadUrl={this.downloadSpreadsheet()}
          transition={this.transition}
          transitions={this.state.transitions}
          classifications={this.classifications}
          toTotalData={this.toTotalData()}
          fromTotalData={this.fromTotalData()} />
      );
    }
  }

  renderWarning(key) {
    if(this.mode == key && this.state.showWarning[key]) {
      return(
        <WarningModal
          title={I18n.t(`map.warning.${key}.title`)}
          onClose={this.closeWarning.bind(this, key)}
          html={I18n.t(`map.warning.${key}.body`)}
        />
      );
    }
  }

  componentDidMount() {
    this.loadCards();
    this.loadQualities(this.year);
  }

  zoomIn() {
    this.refs.canvas.zoomIn();
  }

  zoomOut() {
    this.refs.canvas.zoomOut();
  }

  render() {
    const COVERAGE = this.mode === 'coverage';
    const TRANSITIONS = this.mode === 'transitions';
    const QUALITY = this.mode === 'quality';

    let subsequentYears = _.range(0, this.props.availableYears.length - 1).map((i) => {
      let firstYear = this.props.availableYears[i];
      let secondYear = this.props.availableYears[i + 1];

      return {
        label: I18n.t('map.index.transitions.period', {first_year: firstYear, second_year: secondYear}),
        value: [firstYear, secondYear]
      }
    });

    let periodOptions = [
      {
        label: I18n.t('map.index.transitions.all_years'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2000, second_year: 2016}),
          value: [2000, 2016]
        }]
      },
      {
        label: I18n.t('map.index.transitions.forest_code'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2008, second_year: 2015}),
          value: [2008, 2015]
        }]
      },
      {
        label: I18n.t('map.index.transitions.subsequent_years'),
        options: subsequentYears
      },
      {
        label: I18n.t('map.index.transitions.five_years'),
        options: [
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2000, second_year: 2005}),
            value: [2000, 2005]
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2005, second_year: 2010}),
            value: [2005, 2010]
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2010, second_year: 2015}),
            value: [2010, 2015]
          }
        ]
      }
    ]

    return (
      <div className="map">
        {this.renderTransitionsMatrix()}
        {this.renderWarning('coverage')}
        {this.renderWarning('transitions')}
        {this.renderWarning('quality')}

        <MapCanvas
          {...this.tileOptions}
          ref="canvas"
          cards={this.state.cards}
          baseMaps={this.props.availableBaseMaps}
          selectedBaseMaps={this.state.baseMaps}
          mode={this.mode}
          year={this.year}
          territory={this.territory}
          layers={this.props.availableLayers}
          selectedLayers={this.state.layers}
          qualities={this.state.qualities}
          qualityInfo={this.props.qualityInfo}
          qualityCardsUrl={this.props.qualityCardsUrl}
        />

        <div className="map-panel__wrapper">
          <div className="map-panel__area map-panel__sidebar">
            <ZoomAndOpacityPanel
              zoomIn={this.zoomIn.bind(this)}
              zoomOut={this.zoomOut.bind(this)}
              opacity={this.state.opacity}
              setOpacity={this.setOpacity.bind(this)}
            />
            <TerritoryPanel
              territory={this.territory}
              loadTerritories={this.loadTerritories.bind(this)}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
            />

            {TRANSITIONS && (
              <div className="map-panel__content map-panel__action-panel">
                <Select
                  options={periodOptions}
                  onChange={this.handleTransitionsPeriodChange.bind(this)}
                  placeholder="Selecione um período"
                  value={this.state.transitionsPeriod}
                />
              </div>
            )}

            {COVERAGE && (
              <div className="map-panel__grow" id="left-sidebar-grown-panel">
                <CoverageAuxiliarControls
                  mode={this.mode}
                  mapProps={this.props}
                  opacity={this.state.opacity}
                  viewOptionsIndex={this.state.viewOptionsIndex}
                  handleViewOptionsIndexSelect={this.handleViewOptionsIndexSelect.bind(this)}
                  classifications={this.classifications}
                  availableClassifications={this.props.availableClassifications}
                  handleClassificationsChange={this.handleClassificationsChange.bind(this)}
                  baseMaps={this.baseMaps}
                  availableBaseMaps={this.props.availableBaseMaps}
                  handleBaseMapsChange={this.handleBaseMapsChange.bind(this)}
                  layers={this.layers}
                  availableLayers={this.props.availableLayers}
                  handleLayersChange={this.handleLayersChange.bind(this)}
                />
              </div>
            )}

            {QUALITY && (
              <div id="quality-labels">
                <QualityLabels />
              </div>
            )}
          </div>
            <div className="map-panel__area map-panel__main">
              {!TRANSITIONS && (
                  <YearControl
                    className="map-panel__bottom"
                    playStop={true}
                    onValueChange={this.handleYearChange.bind(this)}
                    defaultValue={this.timelineDefaultValue()}
                    range={this.props.availableYears} />
              )}
            </div>
          <div className="map-panel__area map-panel__sidebar">
            <div className="map-panel__grow" id="right-sidebar-grown-panel">
              <MainMenu
                mode={this.mode}
                onModeChange={this.handleModeChange.bind(this)}
                calcMaxHeight={() => (
                  $('#right-sidebar-grown-panel').height() - (
                    this.mode === 'quality' ? (
                      $('#quality-labels').height() + 55
                    ) : 55
                  )
                )}
                coveragePanel={(
                  <div>
                    <CoveragePieChart
                      {...this.props}
                      territory={this.territory}
                      year={this.year}
                      classifications={this.classifications}
                    />
                    {/* Line Chart goes here */}
                  </div>
                )}
                transitionsPanel={(
                  <TransitionsControl
                    {...this.props}
                    transition={this.transition}
                    transitions={this.state.transitions}
                    classifications={this.classifications}
                    territory={this.territory}
                    years={this.years}
                    onExpandMatrix={this.expandTransitionsMatrix.bind(this)}
                    onTransitionsLoad={this.handleTransitionsLoad.bind(this)}
                    setTransition={this.handleTransitionChange.bind(this)}
                  />
                )}
                qualityPanel={(
                  <QualityChart
                    {...this.props}
                    cards={this.state.cards}
                    territory={this.territory}
                    year={this.year}
                    classifications={this.classifications}
                    qualities={this.state.qualities}
                    qualityInfo={this.props.qualityInfo}
                  />
                )}
              />

            </div>
          </div>
        </div>

      </div>
    );
  }
}
