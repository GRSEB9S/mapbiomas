import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import Select from 'react-select-plus';
import { Tabs } from 'react-tabs';

import { MapCanvas } from '../map/map_canvas';

import { API } from '../../lib/api';
import { Classifications } from '../../lib/classifications';
import { Territories } from '../../lib/territories';

import StatsModal from '../modals/stats';
import TransitionsModal from '../modals/transitions_chart_and_matrix';
import WarningModal from '../modals/warning';

import TerritoryControl from '../controls/territory';
import YearControl from '../controls/year';
import ZoomAndOpacityControl from '../controls/zoom_and_opacity';

import CoverageAuxiliarControls from '../panels/coverage/auxiliar_controls';
import CoverageMenu from '../panels/coverage/menu';
import MainMenu from '../panels/main_menu';
import QualityLabels from '../panels/quality/labels';
import QualityMenu from '../panels/quality/menu';
import TransitionsMenu from '../panels/transitions/menu';
import TransitionsAuxiliarControls from '../panels/transitions/auxiliar_controls';

Tabs.setUseDefaultStyles(false);

const DENSE_FOREST_ID = 3;

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState = {
      baseMaps: null,
      classifications: null,
      hide: false,
      layers: null,
      mode: location.hash.replace('#', '') || 'coverage',
      opacity: 1,
      qualities: [],
      showWarning: {
        coverage: true,
        transitions: true,
        quality: true
      },
      showModals: {
        coverage: false,
        transitions: false
      },
      territory: null,
      territoryTab: 0,
      transition: null,
      transitions: [],
      transitionsLayers: [1, 2, 3, 4, 5],
      transitionsPeriod: '',
      viewOptionsIndex: {
        coverage: 0,
        transitions: 0
      },
      year: null,
      years: []
    };
  }

  //Props
  get classifications() {
    return this.state.classifications || this.props.defaultClassifications;
  }

  get firstLevelClassifications() {
    let tree = new Classifications(this.props.defaultClassifications).buildTree();

    return _.map(tree, (c, i) => parseInt(i));
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
    return this.state.mode;
  }

  get transitionsDataLayerOptions() {
    let fromId, toId;
    let transitionInfo = {};

    if(this.state.transition) {
      transitionInfo = {
        transition_c0: this.state.transition.from,
        transition_c1: this.state.transition.to
      }
    }

    return {
      ...transitionInfo,
      year_t0: this.years[0],
      year_t1: this.years[1],
      transitions_group: this.state.transitionsLayers,
      transparent: true
    }
  }

  get coverageDataLayerOptions() {
    let ids = this.classifications.map((c) => c.id);

    return {
      year: this.year,
      classification_ids: ids
    };
  }

  get dataLayerOptions() {
    return {
      coverage: this.coverageDataLayerOptions,
      transitions: this.transitionsDataLayerOptions
    };
  }

  get year() {
    return this.state.year || 2015;
  }

  get years() {
    if(_.isEmpty(this.state.years)) {
      return [_.first(this.props.availableYears), _.last(this.props.availableYears)];
    } else {
      return this.state.years
    }
  }

  get transitionsPeriod() {
    if(_.isEmpty(this.state.transitionsPeriod)) {
      return `${this.years[0]}-${this.years[1]}`;
    } else {
      return this.state.transitionsPeriod;
    }
  }

  get subsequentYears() {
    return _.range(0, this.props.availableYears.length - 1).map((i) => {
      let firstYear = this.props.availableYears[i];
      let secondYear = this.props.availableYears[i + 1];

      return {
        label: I18n.t('map.index.transitions.period', {first_year: firstYear, second_year: secondYear}),
        value: `${firstYear}-${secondYear}`
      }
    });
  }

  get periodOptions() {
    return [
      {
        label: I18n.t('map.index.transitions.all_years'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2000, second_year: 2016}),
          value: '2000-2016'
        }]
      },
      {
        label: I18n.t('map.index.transitions.forest_code'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2008, second_year: 2016}),
          value: '2008-2016'
        }]
      },
      {
        label: I18n.t('map.index.transitions.subsequent_years'),
        options: this.subsequentYears
      },
      {
        label: I18n.t('map.index.transitions.five_years'),
        options: [
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2000, second_year: 2005}),
            value: '2000-2005'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2005, second_year: 2010}),
            value: '2005-2010'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2010, second_year: 2015}),
            value: '2010-2015'
          }
        ]
      }
    ]
  }

  //Handlers
  handleModeChange(mode) {
    this.setState({
      mode,
      territoryTab: 0
    });
    window.location.hash = `#${mode}`;
  }

  handleTerritoryTabChange(territoryTab) {
    this.setState({ territoryTab });
  }

  handleTerritoryChange(territory) {
    this.setState({
      territory,
      transition: null
    })
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

  handleTransitionsLayersChange(ids) {
    this.setState({
      transitionsLayers: ids
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
      showModals: {
        ...this.state.showModals,
        transitions: false
      }
    });
  }

  handleTransitionReset() {
    this.setState({ transition: null });
  }

  handleTransitionsLoad(transitions) {
    this.setState({ transitions });
  }

  setOpacity(opacity) {
    this.setState({ opacity });
  }

  toggleHide() {
    this.setState({ hide: !this.state.hide });
  }

  handleMainMenuIndexSelect(index) {
    this.setState({ mainMenuIndex: index });
  }

  handleViewOptionsIndexSelect(mode, index) {
    let viewOptionsIndex = {
      ...this.state.viewOptionsIndex,
      [mode]: index
    }

    this.setState({ viewOptionsIndex });
  }

  handleTransitionsPeriodChange(period) {
    this.setState({
      years: period.value.split('-'),
      transitionsPeriod: period.value
    });
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

  closeWarning(mode) {
    this.setState({
      showWarning: {
        ...this.state.showWarning,
        [mode]: false
      }
    })
  }

  expandModal(mode) {
    this.setState({
      showModals: {
        ...this.state.showModals,
        [mode]: true
      }
    });
  }

  closeModal(mode) {
    this.setState({
      showModals: {
        ...this.state.showModals,
        [mode]: false
      }
    });
  }

  downloadTransitions() {
    let params = {
      territory_id: this.territory.id,
      territory_name: this.territory.name,
      year: this.years.join(',')
    };

    return Routes.download_transitions_path(params);
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

  renderStatsModal() {
    if(this.state.showModals.coverage) {
      return (
        <StatsModal
          classifications={this.props.defaultClassifications}
          years={this.props.availableYears}
          selectedTerritories={[this.territory]}
          selectedClassifications={this.firstLevelClassifications}
          onClose={this.closeModal.bind(this, 'coverage')}
        />
      );
    }

    return null;
  }

  renderTransitionsModal() {
    if(this.state.showModals.transitions) {
      return (
        <TransitionsModal
          setTransition={this.handleTransitionChange.bind(this)}
          onClose={this.closeModal.bind(this, 'transitions')}
          years={this.years}
          downloadUrl={this.downloadTransitions()}
          transition={this.transition}
          transitions={this.state.transitions}
          classifications={this.classifications}
          toTotalData={this.toTotalData()}
          fromTotalData={this.fromTotalData()}
        />
      );
    }

    return null;
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

    return null;
  }

  componentDidMount() {
    this.loadCards();
    this.loadQualities(this.year);
    window.addEventListener("hashchange", () =>
      this.setState({ mode: location.hash.replace('#', '') }), false);
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

    return (
      <div className={`map ${this.state.hide ? 'hide-panels' : ''}`}>
        {this.renderStatsModal()}
        {this.renderTransitionsModal()}
        {this.renderWarning('coverage')}
        {this.renderWarning('transitions')}
        {this.renderWarning('quality')}

        <MapCanvas
          dataLayerOptions={this.dataLayerOptions}
          apiUrl={this.props.apiUrl}
          transition={this.state.transition}
          opacity={this.state.opacity}
          ref="canvas"
          cards={this.state.cards}
          baseMaps={this.props.availableBaseMaps}
          selectedBaseMaps={this.state.baseMaps}
          mode={this.mode}
          year={this.year}
          years={this.years}
          territory={this.territory}
          layers={this.props.availableLayers}
          selectedLayers={this.state.layers}
          qualities={this.state.qualities}
          qualityInfo={this.props.qualityInfo}
          qualityCardsUrl={this.props.qualityCardsUrl}
        />

        <div className="map-panel__wrapper">
          <div className="map-panel__area map-panel__sidebar">
            <ZoomAndOpacityControl
              zoomIn={this.zoomIn.bind(this)}
              zoomOut={this.zoomOut.bind(this)}
              opacity={this.state.opacity}
              hiddenPanels={this.state.hide}
              setOpacity={this.setOpacity.bind(this)}
              hidePanels={this.toggleHide.bind(this)}
            />
            <TerritoryControl
              tabIndex={this.state.territoryTab}
              territory={this.territory}
              loadTerritories={this.loadTerritories.bind(this)}
              onTabChange={this.handleTerritoryTabChange.bind(this)}
              onTerritoryChange={this.handleTerritoryChange.bind(this)}
            />

            {TRANSITIONS && (
              <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
                <Select
                  options={this.periodOptions}
                  onChange={this.handleTransitionsPeriodChange.bind(this)}
                  value={this.transitionsPeriod}
                  clearable={false}
                />
              </div>
            )}

            {COVERAGE && (
              <div className="map-panel__grow map-panel-can-hide" id="coverage-auxiliar-controls">
                <CoverageAuxiliarControls
                  availableClassifications={this.props.availableClassifications}
                  classifications={this.classifications}
                  availableBaseMaps={this.props.availableBaseMaps}
                  baseMaps={this.baseMaps}
                  availableLayers={this.props.availableLayers}
                  layers={this.layers}
                  viewOptionsIndex={this.state.viewOptionsIndex.coverage}
                  handleClassificationsChange={this.handleClassificationsChange.bind(this)}
                  handleBaseMapsChange={this.handleBaseMapsChange.bind(this)}
                  handleLayersChange={this.handleLayersChange.bind(this)}
                  handleViewOptionsIndexSelect={this.handleViewOptionsIndexSelect.bind(this, 'coverage')}
                />
              </div>
            )}

            {TRANSITIONS && (
              <div className="map-panel__grow map-panel-can-hide" id="transitions-auxiliar-controls">
                <TransitionsAuxiliarControls
                  availableTransitionsLayers={this.initialState.transitionsLayers}
                  transitionsLayers={this.state.transitionsLayers}
                  availableBaseMaps={this.props.availableBaseMaps}
                  baseMaps={this.baseMaps}
                  availableLayers={this.props.availableLayers}
                  layers={this.layers}
                  transition={this.state.transition}
                  classifications={this.classifications}
                  viewOptionsIndex={this.state.viewOptionsIndex.transitions}
                  handleTransitionsLayersChange={this.handleTransitionsLayersChange.bind(this)}
                  handleBaseMapsChange={this.handleBaseMapsChange.bind(this)}
                  handleLayersChange={this.handleLayersChange.bind(this)}
                  handleViewOptionsIndexSelect={this.handleViewOptionsIndexSelect.bind(this, 'transitions')}
                  handleTransitionReset={this.handleTransitionReset.bind(this)}
                />
              </div>
            )}

            {QUALITY && (
              <div className="map-panel-can-hide" id="quality-labels">
                <QualityLabels />
              </div>
            )}
          </div>
          <div className="map-panel__area map-panel__main map-panel-can-hide">
            {!TRANSITIONS && (
                <YearControl
                  className="map-panel__bottom"
                  playStop={true}
                  onValueChange={this.handleYearChange.bind(this)}
                  defaultValue={this.timelineDefaultValue()}
                  range={this.props.availableYears} />
            )}
          </div>
          <div className="map-panel__area map-panel__sidebar map-panel-can-hide">
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
                  <CoverageMenu
                    {...this.props}
                    territory={this.territory}
                    year={this.year}
                    classifications={this.classifications}
                    onExpandModal={this.expandModal.bind(this, 'coverage')}
                  />
                )}
                transitionsPanel={(
                  <TransitionsMenu
                    {...this.props}
                    transition={this.transition}
                    transitions={this.state.transitions}
                    classifications={this.classifications}
                    territory={this.territory}
                    years={this.years}
                    onExpandModal={this.expandModal.bind(this, 'transitions')}
                    onTransitionsLoad={this.handleTransitionsLoad.bind(this)}
                  />
                )}
                qualityPanel={(
                  <QualityMenu
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
