import React from 'react';
import _ from 'underscore';
import ReactTimelineSlider from 'react-timeline-slider';
import { API } from '../../lib/api';
import { CoverageControl } from '../control/coverage_control';
import { MapCanvas } from '../map/map_canvas';
import { MapModal } from '../map/map_modal';
import { OpacityControl } from '../control/opacity_control';
import { QualityControl } from '../control/quality/quality_control';
import { QualityLabels } from '../control/quality/quality_labels';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { TogglesControl } from '../control/toggles_control';
import { TransitionsControl } from '../control/transitions/transitions_control';
import { TransitionsMatrix } from '../control/transitions/transitions_matrix';

Tabs.setUseDefaultStyles(false);

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mainMenuIndex: 0,
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
        url: this.props.apiUrl,
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
  handleTerritoryChange(newTerritory) {
    let territory = this.props.availableTerritories.find((t) => t.id == newTerritory.value);
    this.setState({ territory })
  }

  handleYearChange(newYear) {
    this.setState({ year: newYear, years: newYear });
    this.loadQualities(newYear);
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

  renderTransitionsMatrix() {
    if(this.state.transitionsMatrixExpanded) {
      return (
        <MapModal title={I18n.t('map.index.transitions.matrix.title')}
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

  renderWarning(key) {
    if(this.mode == key && this.state.showWarning[key]) {
      return(
        <MapModal title={I18n.t(`map.warning.${key}.title`)}
          showCloseButton={false}
          showOkButton={true}
          verticalSmaller={true}
          horizontalSmaller={true}
          overlay={true}
          onClose={this.closeWarning.bind(this, key)}>

          <div dangerouslySetInnerHTML={{__html: I18n.t(`map.warning.${key}.body`)}}></div>
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
            opacity={this.state.opacity * 100}
            onChange={this.handleOpacityChange.bind(this)} />

          <Tabs
              selectedIndex={this.state.viewOptionsIndex}
              onSelect={this.handleViewOptionsIndexSelect.bind(this)}>

            <TabList className="three-tabbed">
              <Tab>{I18n.t('map.index.classifications')}</Tab>
              <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
              <Tab>{I18n.t('map.index.layers.title')}</Tab>
            </TabList>

            <TabPanel>
              <TogglesControl
                options={this.classifications}
                availableOptions={this.props.availableClassifications}
                title={I18n.t('map.index.classifications')}
                tooltip={I18n.t('map.tooltip')}
                onChange={this.handleClassificationsChange.bind(this)}
              />
            </TabPanel>

            <TabPanel>
              <TogglesControl
                options={this.baseMaps}
                availableOptions={this.props.availableBaseMaps}
                title={I18n.t('map.index.base_maps.title')}
                onChange={this.handleBaseMapsChange.bind(this)}
              />
            </TabPanel>

            <TabPanel>
              <TogglesControl
                options={this.layers}
                availableOptions={this.props.availableLayers}
                title={I18n.t('map.index.layers.title')}
                onChange={this.handleLayersChange.bind(this)}
              />
            </TabPanel>
          </Tabs>
        </div>
      );
    }
  }

  renderQualityAuxiliarControls() {
    if(this.mode == 'quality') {
      return(
        <div className="map-control-wrapper
            map-control-wrapper--smaller
            map-control-wrapper--left
            map-control-wrapper--bottom">
          <QualityLabels />
        </div>
      );
    }
  }

  renderMainMenu() {
    return(
      <Tabs
          selectedIndex={this.state.mainMenuIndex}
          onSelect={this.handleMainMenuIndexSelect.bind(this)}
          className="map-control-wrapper">

        <TabList className="three-tabbed">
          <Tab>{I18n.t('map.index.coverage.title')}</Tab>
          <Tab>{I18n.t('map.index.transitions.title')}</Tab>
          <Tab>{I18n.t('map.index.quality.title')}</Tab>
        </TabList>

        <TabPanel>
          <CoverageControl
            {...this.props}
            availableTerritories={this.territories}
            territory={this.territory}
            year={this.year}
            classifications={this.classifications}
            onTerritoryChange={this.handleTerritoryChange.bind(this)}
          />
        </TabPanel>

        <TabPanel>
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
        </TabPanel>

        <TabPanel>
          <QualityControl
            {...this.props}
            cards={this.state.cards}
            availableTerritories={this.territories}
            territory={this.territory}
            year={this.year}
            classifications={this.classifications}
            qualities={this.state.qualities}
            qualityInfo={this.props.qualityInfo}
            onTerritoryChange={this.handleTerritoryChange.bind(this)}
          />
        </TabPanel>
      </Tabs>
    );
  }

  componentDidMount() {
    this.loadCards();
    this.loadQualities(this.year);
  }

  render() {
    return (
      <div className="map">
        {this.renderWarning('coverage')}
        {this.renderWarning('transitions')}
        {this.renderWarning('quality')}

        <MapCanvas
          {...this.tileOptions}
          cards={this.state.cards}
          baseMaps={this.props.availableBaseMaps}
          selectedBaseMaps={this.state.baseMaps}
          mode={this.mode}
          territory={this.territory}
          layers={this.props.availableLayers}
          selectedLayers={this.state.layers}
          qualities={this.state.qualities}
          qualityInfo={this.props.qualityInfo}
          qualityCardsUrl={this.props.qualityCardsUrl}
        />

        {this.renderCoverageAuxiliarControls()}
        {this.renderMainMenu()}
        {this.renderTransitionsMatrix()}
        {this.renderQualityAuxiliarControls()}

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
