import React from 'react';
import _ from 'underscore';
import ReactTimelineSlider from 'react-timeline-slider';
import classNames from 'classnames';
import { API } from '../../lib/api';
import { MapCanvas } from '../map/map_canvas';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Territories } from '../../lib/territories';

// import QualityAuxiliarControls from './panels/quality_auxiliar_controls';
// import TransitionsMatrixModal from './modals/transitions_matrix';

import WarningModal from './modals/warning';
import ZoomAndOpacityPanel from './panels/zoom_and_opacity';
import TerritoryPanel from './panels/territory';
import CoverageAuxiliarControls from './panels/coverage_auxiliar_controls';
import MainMenu from './panels/main_menu';
import QualityLabels from './panels/quality_labels';
import QualityControl from '../control/quality/quality_control';

Tabs.setUseDefaultStyles(false);

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'coverage',
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
        return 'wms/classification/transitions.map';
      default:
        return 'wms-c2/classification/coverage.map';
    }
  }

  get tileOptions() {
    let ids = this.classifications.map((c) => c.id);
    let year = this.mode == 'coverage' ? this.year : this.years.join(',');
    let transitionId;

    if(this.state.transition) {
      transitionId = `${this.state.transition.from}${this.state.transition.to}`;
    }

    return {
      layerOptions: {
        layers: this.mode,
        // url: this.props.apiUrl,
        url: 'http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv',
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
    this.setState({ transition });
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

  isMulti() {
    return this.mode == 'transitions';
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
          onClose={this.closeTransitionsMatrix.bind(this)}
          years={this.years}
          downloadUrl={this.downloadSpreadsheet()}
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

  renderQualityAuxiliarControls() {
    return (
      <QualityAuxiliarControls mode={this.mode} />
    );
  }

  renderMainMenu() {
    return (
      <MainMenu
        mapProps={this.props}
        mode={this.mode}
        menuIndex={this.state.mainMenuIndex}
        onSelect={this.handleMainMenuIndexSelect.bind(this)}
        transition={this.transition}
        transitions={this.state.transitions}
        years={this.years}
        onExpandMatrix={this.expandTransitionsMatrix.bind(this)}
        onTransitionsLoad={this.handleTransitionsLoad.bind(this)}
        setTransition={this.handleTransitionChange.bind(this)}
        cards={this.state.cards}
        territory={this.territory}
        year={this.year}
        classifications={this.classifications}
        qualities={this.state.qualities}
        qualityInfo={this.props.qualityInfo}
        onTerritoryChange={this.handleTerritoryChange.bind(this)}
        loadTerritories={this.loadTerritories.bind(this)}
      />
    );
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

    return (
      <div className="map">
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

        <div className="map-panel map-panel--left map-panel--top">
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

          {COVERAGE && (
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
          )}
        </div>

        <div className="map-panel map-panel--right map-panel--top">
          <MainMenu
            mode={this.mode}
            onModeChange={this.handleModeChange.bind(this)}
            coveragePanel={(
              <ul>
                <li>Pie Chart</li>
                <li>Line Chart</li>
              </ul>
            )}
            transitionsPanel={(
              <ul>
                <li>Sankey Diagram</li>
              </ul>
            )}
            qualityPanel={(
              <QualityControl
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

          {QUALITY && <QualityLabels />}
        </div>

        
        <div className="timeline-control">
          <ReactTimelineSlider
            multi={this.isMulti()}
            playStop={true}
            onValueChange={this.handleYearChange.bind(this)}
            defaultValue={this.timelineDefaultValue()}
            range={this.props.availableYears} />
        </div>
      </div>
    );
  }
}
