import React from 'react';
import _ from 'underscore';
import lodash from 'lodash';
import Select from 'react-select-plus';
import { Tabs } from 'react-tabs';

import { MapCanvas } from '../map/map_canvas';
import { MyMaps } from '../map/my_maps';

import { API } from '../../lib/api';
import { Classifications } from '../../lib/classifications';
import { Territories } from '../../lib/territories';

import TutorialModal from '../modals/tutorial';
import PointModal from '../modals/point';
import StatsModal from '../modals/stats';
import TransitionsModal from '../modals/transitions_chart_and_matrix';
import WarningModal from '../modals/warning';

import ClassificationControl from '../controls/classification';
import TerritoryControl from '../controls/territory';
import YearControl from '../controls/year';
import ZoomAndOpacityControl from '../controls/zoom_and_opacity';

import CoverageAuxiliarControls from '../panels/coverage/auxiliar_controls';
import CoverageMenu from '../panels/coverage/menu';
import MainMenu from '../panels/main_menu';
import QualityMenu from '../panels/quality/menu';
import QualityAuxiliarControls from '../panels/quality/auxiliar_controls';
import TransitionsMenu from '../panels/transitions/menu';
import TransitionsAuxiliarControls from '../panels/transitions/auxiliar_controls';
import TransitionsLabels from '../panels/transitions/labels';

Tabs.setUseDefaultStyles(false);

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState = {
      baseMaps: null,
      classifications: null,
      hide: false,
      pointClick: false,
      layers: null,
      mode: location.hash.replace('#', '') || 'coverage',
      myMaps: null,
      myMapTerritories: null,
      opacity: 1,
      qualities: [],
      selectedPoint: {},
      selectedMap: null,
      showTutorial: false,
      showWarning: {
        coverage: true,
        transitions: true,
        quality: true
      },
      showModals: {
        coverage: false,
        transitions: false,
        point: false
      },
      territory: null,
      territoryCategory: null,
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
  get territoryCategories() {
    return [
      { id: 'country', value: 'País', label: I18n.t('map.index.category.countries.many'), preloaded: true },
      { id: 'state', value: 'Estado', label: I18n.t('map.index.category.states.many'), preloaded: true },
      { id: 'city', value: 'Municipio', label: I18n.t('map.index.category.cities.many') },
      { id: 'biome', value: 'Bioma', label: I18n.t('map.index.category.biomes.many'), preloaded: true },
      { id: 'watershedLevel1', value: 'Bacias Nivel 1', label: I18n.t('map.index.category.macro_watersheds.many'), preloaded: true },
      { id: 'watershedLevel2', value: 'Bacias Nivel 2', label: I18n.t('map.index.category.watersheds.many'), preloaded: true },
      { id: 'indigenousLand', value: 'Terra Indígena', label: I18n.t('map.index.category.indigenous_lands.many'), preloaded: true },
      { id: 'conservationUnit', value: 'UC', label: I18n.t('map.index.category.conservation_units.many'), preloaded: true },
      { id: 'afroBrazilianSettlements', value: 'Quilombolas', label: I18n.t('map.index.category.afro_brazilian_settlements.many'), preloaded: true },
      { id: 'smallholderSettlements', value: 'Assentamentos', label: I18n.t('map.index.category.smallholder_settlements.many'), preloaded: true }
    ];
  }

  get territoryCategory() {
    return this.state.territoryCategory || _.first(this.territoryCategories).value;
  }

  get classifications() {
    return this.state.classifications || this.props.defaultClassifications;
  }

  get defaultClassificationsObject() {
    return new Classifications(this.props.defaultClassifications);
  }

  get defaultClassificationsTree() {
    return this.defaultClassificationsObject.buildTree();
  }

  get firstLevelClassifications() {
    return _.map(this.defaultClassificationsTree, (c, i) => parseInt(i));
  }

  get baseMaps() {
    return this.state.baseMaps || this.props.defaultBaseMaps;
  }

  get layers() {
    return this.state.layers || this.props.defaultLayers;
  }

  get defaultTerritory() {
    let defaultTerritory = new Territories([this.props.defaultTerritory]).withOptions();

    return _.first(defaultTerritory);
  }

  get territory() {
    if (!_.isEmpty(this.state.myMapTerritories)) {
      return this.state.myMapTerritories;
    }

    if (_.isEmpty(this.state.territory)) {
      return [this.defaultTerritory];
    }

    return [this.state.territory];
  }

  get territoryArray() {
    if(_.isArray(this.territory)) {
      return this.territory;
    } else {
      return [this.territory];
    }
  }

  get transition() {
    return this.state.transition || this.state.transitions[0];
  }

  get transitionsLayers() {
    return this.state.transitionsLayers || [];
  }

  get mode() {
    return this.state.mode;
  }

  get coverageDataLayerOptions() {
    let ids = this.classifications.map((c) => c.id);

    return {
      layers: 'coverage',
      map: 'wms/v/3.0/classification/coverage.map',
      territory_id: _.map(this.territoryArray, (t) => t.value),
      year: this.year,
      classification_ids: ids
    };
  }

  get transitionsDataLayerOptions() {
    let transitionInfo = {};
    let map;

    if(this.state.transition) {
      transitionInfo = {
        transition_c0: this.state.transition.from,
        transition_c1: this.state.transition.to
      }
    } else {
      transitionInfo = {
        transitions_group: this.transitionsLayers
      }
    }

    if (this.mode == 'transitions' && !this.state.transition) {
      map = 'wms/v/3.0/classification/transitions_group.map';
    } else {
      map = 'wms/v/3.0/classification/transitions.map';
    }

    return {
      ...transitionInfo,
      layers: 'transitions',
      map: map,
      territory_id: _.map(this.territoryArray, (t) => t.value),
      year_t0: this.years[0],
      year_t1: this.years[1]
    };
  }

  get qualityDataLayerOptions() {
    return {
      layers: 'availability',
      map: 'wms/v/3.0/classification/availability.map',
      year: this.year
    };
  }

  get dataLayerOptions() {
    return {
      coverage: this.coverageDataLayerOptions,
      transitions: this.transitionsDataLayerOptions,
      quality: this.qualityDataLayerOptions
    };
  }

  get year() {
    return this.state.year || this.props.defaultYear;
  }

  get years() {
    if(_.isEmpty(this.state.years)) {
      return [_.first(this.props.availableYears), _.last(this.props.availableYears)];
    } else {
      return this.state.years
    }
  }

  get myMaps() {
    return this.state.myMaps || this.props.myMaps;
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
          label: I18n.t('map.index.transitions.period', {first_year: 1985, second_year: 2017}),
          value: '1985-2017'
        }]
      },
      {
        label: I18n.t('map.index.transitions.forest_code'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2008, second_year: 2017}),
          value: '2008-2017'
        }]
      },
      {
        label: I18n.t('map.index.transitions.forest_code_approval'),
        options: [{
          label: I18n.t('map.index.transitions.period', {first_year: 2012, second_year: 2017}),
          value: '2012-2017'
        }]
      },
      {
        label: I18n.t('map.index.transitions.national_emissions_inventory'),
        options: [
          {
            label: I18n.t('map.index.transitions.period', {first_year: 1994, second_year: 2002}),
            value: '1994-2002'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2000, second_year: 2010}),
            value: '2000-2010'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 2010, second_year: 2016}),
            value: '2010-2016'
          }
        ]
      },
      {
        label: I18n.t('map.index.transitions.subsequent_years'),
        options: this.subsequentYears
      },
      {
        label: I18n.t('map.index.transitions.five_years'),
        options: [
          {
            label: I18n.t('map.index.transitions.period', {first_year: 1985, second_year: 1990}),
            value: '1985-1990'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 1990, second_year: 1995}),
            value: '1990-1995'
          },
          {
            label: I18n.t('map.index.transitions.period', {first_year: 1995, second_year: 2000}),
            value: '1995-2000'
          },
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

  defaultClassificationsTreeIds(tree = this.defaultClassificationsTree, ids = []) {
    return lodash.toPairs(tree).reduce((ids, [id, child]) => {
      ids.push(lodash.toNumber(id))
      return this.defaultClassificationsTreeIds(child.children, ids)
    }, ids)
  }

  mapParams(name) {
    return {
      name: name,
      options: {
        base_maps: this.baseMaps.map((m) => m.id),
        layers: this.layers.map((l) => l.id),
        territory: this.territory,
        ...this.coverageDataLayerOptions,
        ...this.transitionsDataLayerOptions
      }
    };
  }

  //Handlers
  handlePointClick(e) {
    if (this.state.pointClick) {
      API.inspector({
        year: this.year,
        lat: e.latlng.lat,
        lng: e.latlng.lng
      }).then((result) => {
        let newState = {
          showModals: {
            point: true
          },
          selectedPoint: {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          }
        }

        if (!_.isEmpty(result)) {
          let categories = lodash.reduce(this.territoryCategories, (obj, item) => {
            obj[item.id] = lodash.find(result, ['categoria', item.value]);

            return obj;
          }, {});

          newState.selectedPoint = {
            ...newState.selectedPoint,
            categories: categories
          }
        }

        this.setState(newState);
      });
    }
  }

  handleModeChange(mode) {
    this.setState({ mode });

    window.location.hash = `#${mode}`;
  }

  handleTerritoryTabChange(territoryCategory) {
    this.setState({ territoryCategory: territoryCategory.value });
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

  setOpacity(opacity) {
    this.setState({ opacity });
  }

  toggleHide() {
    this.setState({ hide: !this.state.hide });
  }

  togglePointClick() {
    this.setState({ pointClick: !this.state.pointClick });
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

  filterOptions(collection, selectedOptions) {
    return _.filter(collection, (m) => {
      return _.include(selectedOptions, m.id);
    });
  }

  handleMapSelect(map) {
    let selectedMap;

    if (this.props.iframe) {
      selectedMap = map;
    } else {
      selectedMap = this.myMaps.find((m) => m.id == map.value);
    }

    let options = selectedMap.options;
    let layerOptions = {};


    layerOptions = {
      classifications: this.filterOptions(this.props.availableClassifications, options.classification_ids),
      year: parseInt(options.year),
      transitionsLayers: options.transitions_group
    };

    if (options.year_t0 && options.year_t1) {
      layerOptions = {
        ...layerOptions,
        years: [options.year_t0, options.year_t1],
      }
    }

    if (options.transition_c0 && options.transition_c1) {
      layerOptions = {
        ...layerOptions,
        transition: {
          from: options.transition_c0,
          to: options.transition_c1
        }
      };
    }

    this.setState({
      ...this.initialState,
      ...layerOptions,
      selectedMap: selectedMap,
      baseMaps: this.filterOptions(this.props.availableBaseMaps, options.base_maps),
      layers: this.filterOptions(this.props.availableLayers, options.layers),
      territory: options.territory,
      myMaps: this.myMaps,
      myMapTerritories: options.territory
    });
  }

  handleMapTerritoriesSelect(myMapTerritories) {
    this.setState({ myMapTerritories });
  }

  handleMapSave(name) {
    API.createMap(this.mapParams(name)).then((response) => {
      this.setState({
        selectedMap: response,
        myMaps: [
          ...this.myMaps,
          response
        ]
      });
    });
  }

  handleMapEdit(name) {
    API.updateMap(this.state.selectedMap.id, this.mapParams(name)).then((response) => {
      let myMaps = _.reject(_.clone(this.state.myMaps), (m) => m.id == response.id);

      this.setState({
        selectedMap: response,
        myMaps: [
          ...myMaps,
          response
        ]
      })
    });
  }

  handleMapDelete() {
    API.deleteMap(this.state.selectedMap.id)
    .then(() => {
      let myMaps = _.without(this.myMaps, _.find(this.myMaps, (m) => m.id == this.state.selectedMap.id));

      this.setState({
        ...this.initialState,
        myMaps: myMaps
      })
    })
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
      let fromTotalToClassification = this.totalClassificationData(
        toTransitions,
        totalClassificationId,
        element.id
      );

      fromTotalToClassification = {
        ...fromTotalToClassification,
        to_l1: element.l1,
        to_l2: element.l2,
        to_l3: element.l3
      };

      return fromTotalToClassification;
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

      fromClassificationToTotal = {
        ...fromClassificationToTotal,
        from_l1: element.l1,
        from_l2: element.l2,
        from_l3: element.l3
      };

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

  expandTutorial(mode) {
    this.setState({
      showWarning: {
        ...this.state.showWarning,
        [mode]: false
      },
      showTutorial: true
    });
  }

  closeTutorial() {
    this.setState({ showTutorial: false });
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
      territory_id: this.territory.map((t) => t.id).join(','),
      territory_name: this.territory.map((t) => t.name || t.label).join(', '),
      year: this.years.join(',')
    };

    if (this.state.selectedMap) {
      params = {
        ...params,
        map_name: this.state.selectedMap.name
      }
    }

    return Routes.download_transitions_path(params);
  }

  loadTransitions(props = { territory: this.territory, years: this.years }) {
    API.transitions({
      territory_id: props.territory.map((t) => t.id).join(','),
      year: props.years.join(',')
    }).then((transitions) => {
      this.setState({ transitions });
    })
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
            name: `%${input.toUpperCase()}%`
          })
          .then((territories) => {
            callback(null, {
              options: new Territories(territories).withCategory()
            });
          });
        }, 500);
      } else {
        callback(null, { options: [] });
      }
    };
  }

  renderPointModal() {
    if(this.state.showModals.point) {
      return (
        <PointModal
          {...this.props}
          point={this.state.selectedPoint}
          year={this.year}
          years={this.years}
          territory={this.territory}
          selectedClassifications={this.firstLevelClassifications}
          dataLayerOptions={this.dataLayerOptions}
          onClose={this.closeModal.bind(this, 'point')}
          transition={this.transition}
          classifications={this.props.defaultClassifications}
          setTransition={this.handleTransitionChange.bind(this)}
        />
      );
    }

    return null;
  }

  renderStatsModal() {
    if(this.state.showModals.coverage) {
      return (
        <StatsModal
          myMapsPage={this.props.myMapsPage}
          classifications={this.props.defaultClassifications}
          years={this.props.availableYears}
          selectedMap={this.state.selectedMap}
          selectedTerritories={this.territory}
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
          iframe={this.props.iframe}
          setTransition={this.handleTransitionChange.bind(this)}
          treeIds={this.defaultClassificationsTreeIds()}
          years={this.years}
          downloadUrl={this.downloadTransitions()}
          transition={this.transition}
          transitions={this.state.transitions}
          classifications={this.props.defaultClassifications}
          toTotalData={this.toTotalData()}
          fromTotalData={this.fromTotalData()}
          onClose={this.closeModal.bind(this, 'transitions')}
        />
      );
    }

    return null;
  }

  renderWarning(key) {
    let showTutorialButton = this.mode == 'coverage' || this.mode == 'transitions';

    if(!this.props.myMapsPage && !this.props.iframe && this.mode == key && this.state.showWarning[key]) {
      return(
        <WarningModal
          title={I18n.t(`map.warning.${key}.title`)}
          onClose={this.closeWarning.bind(this, key)}
          showTutorialButton={showTutorialButton}
          onTutorialClick={this.expandTutorial.bind(this, key)}
          html={I18n.t(`map.warning.${key}.body`)}
        />
      );
    }

    return null;
  }

  renderTutorial() {
    if(!this.props.iframe && this.state.showTutorial) {
      return(
        <TutorialModal
          mode={this.mode}
          title={I18n.t(`map.index.tutorial.${this.mode}.title`)}
          onClose={this.closeTutorial.bind(this)}
          html={I18n.t(`map.index.tutorial.${this.mode}.body`)}
        />
      );
    }

    return null;
  }

  componentDidUpdate() {
    if (this.state.selectedMap) {
      let src = window.location.origin + Routes.iframe_path(this.state.selectedMap.id)

      $('#embed-code-tooltip').tooltipster({
        theme: 'tooltip-custom-theme',
        interactive: true,
        contentAsHTML: true
      });

      $('#embed-code-tooltip').tooltipster('content', $(I18n.t('my_maps.embed_code.tooltip', { src: src })));
    }
  }

  componentDidMount() {
    if (this.props.iframe) {
      this.handleMapSelect(this.props.iframeMap);
    }

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
        {this.renderTutorial()}
        {this.renderPointModal()}
        {this.renderStatsModal()}
        {this.renderTransitionsModal()}
        {this.renderWarning('coverage')}
        {this.renderWarning('transitions')}
        {this.renderWarning('quality')}

        <MapCanvas
          mainMap={true}
          pointClick={this.state.pointClick}
          myMapsPage={this.props.myMapsPage}
          iframe={this.props.iframe}
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
          selectedLayers={this.state.layers}
          qualities={this.state.qualities}
          onPointClick={this.handlePointClick.bind(this)}
        />

        <div className="map-panel__wrapper">
          <div className="map-panel__area map-panel__sidebar">
            <ZoomAndOpacityControl
              zoomIn={this.zoomIn.bind(this)}
              zoomOut={this.zoomOut.bind(this)}
              opacity={this.state.opacity}
              hiddenPanels={this.state.hide}
              pointClick={this.state.pointClick}
              setOpacity={this.setOpacity.bind(this)}
              enablePointClick={this.togglePointClick.bind(this)}
              hidePanels={this.toggleHide.bind(this)}
              showTutorial={this.expandTutorial.bind(this, this.mode)}
            />

            {this.props.myMapsPage && !this.props.iframe && (
              <MyMaps
                maps={this.myMaps}
                territories={this.state.myMapTerritories}
                selectedMap={this.state.selectedMap}
                onTerritorySelect={this.handleMapTerritoriesSelect.bind(this)}
                onMapSelect={this.handleMapSelect.bind(this)}
                onMapSave={this.handleMapSave.bind(this)}
                onMapEdit={this.handleMapEdit.bind(this)}
                onMapDelete={this.handleMapDelete.bind(this)}
              />
            )}

            {!this.props.iframe && !this.props.myMapsPage && (
              <TerritoryControl
                territoryCategory={this.territoryCategory}
                territoryCategories={this.territoryCategories}
                territory={_.first(this.territory)}
                loadTerritories={this.loadTerritories.bind(this)}
                onTabChange={this.handleTerritoryTabChange.bind(this)}
                onTerritoryChange={this.handleTerritoryChange.bind(this)}
              />
            )}

            {this.props.iframe && COVERAGE && (
              <div className="map-panel__content map-panel-can-hide map-panel__info">
                <h3>{I18n.t('iframe.title')}</h3>

                <label>{I18n.t('iframe.name', {name: this.props.iframeMap.name})}</label>
                <label>{I18n.t('iframe.mode', {mode: this.mode})}</label>
                <label>{I18n.t('iframe.territory', {territory: _.first(this.territory).name})}</label>
                <label>{I18n.t('iframe.year', {year: this.year})}</label>
              </div>
            )}

            {this.props.iframe && COVERAGE && (
              <div className="map-panel__grow map-panel-can-hide" id="iframe-coverage-data">
                <div className="map-panel__action-panel">
                  <ClassificationControl
                    className="map-panel__content"
                    iframe={this.props.iframe}
                    options={this.classifications}
                    availableOptions={this.props.availableClassifications}
                    onChange={this.handleClassificationsChange.bind(this)}
                    calcMaxHeight={() => (
                      $('#iframe-coverage-data').height() - 20
                    )}
                  />
                </div>
              </div>
            )}

            {this.props.iframe && TRANSITIONS && (
              <div className="map-panel__content map-panel-can-hide map-panel__info">
                <h3>{I18n.t('iframe.title')}</h3>

                <label>{I18n.t('iframe.name', {name: this.props.iframeMap.name})}</label>
                <label>{I18n.t('iframe.mode', {mode: this.mode})}</label>
                <label>{I18n.t('iframe.territory', {territory: _.first(this.territory).name})}</label>
                <label>{I18n.t('iframe.years', {year_0: this.years[0], year_1: this.years[1]})}</label>
              </div>
            )}

            {this.props.iframe && TRANSITIONS && (
              <TransitionsLabels
                iframe={this.props.iframe}
                transition={this.state.transition}
                transitionsLayers={this.transitionsLayers}
                classifications={this.classifications}
                availableTransitionsLayers={this.initialState.transitionsLayers}
                handleTransitionReset={this.handleTransitionReset.bind(this)}
                handleTransitionsLayersChange={this.handleTransitionsLayersChange.bind(this)}
              />
            )}

            {!this.props.iframe && TRANSITIONS && (
              <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
                <Select
                  options={this.periodOptions}
                  onChange={this.handleTransitionsPeriodChange.bind(this)}
                  value={this.transitionsPeriod}
                  clearable={false}
                />
              </div>
            )}

            {!this.props.iframe && COVERAGE && (
              <div className="map-panel__grow map-panel-can-hide" id="coverage-auxiliar-controls">
                <CoverageAuxiliarControls
                  defaultClassificationsTree={this.defaultClassificationsTree}
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

            {!this.props.iframe && TRANSITIONS && (
              <div className="map-panel__grow map-panel-can-hide" id="transitions-auxiliar-controls">
                <TransitionsAuxiliarControls
                  availableTransitionsLayers={this.initialState.transitionsLayers}
                  transitionsLayers={this.transitionsLayers}
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

            {!this.props.iframe && QUALITY && (
              <div className="map-panel__grow map-panel-can-hide" id="transitions-auxiliar-controls">
                <QualityAuxiliarControls
                  availableBaseMaps={this.props.availableBaseMaps}
                  baseMaps={this.baseMaps}
                  availableLayers={this.props.availableLayers}
                  layers={this.layers}
                  viewOptionsIndex={this.state.viewOptionsIndex.transitions}
                  handleTransitionsLayersChange={this.handleTransitionsLayersChange.bind(this)}
                  handleBaseMapsChange={this.handleBaseMapsChange.bind(this)}
                  handleLayersChange={this.handleLayersChange.bind(this)}
                  handleViewOptionsIndexSelect={this.handleViewOptionsIndexSelect.bind(this, 'transitions')}
                />
              </div>
            )}
          </div>

          <div className="map-panel__area map-panel__main map-panel-can-hide">
            {!this.props.iframe && !TRANSITIONS && (
              <YearControl
                className="map-panel__bottom"
                playStop={true}
                onValueChange={this.handleYearChange.bind(this)}
                defaultValue={this.timelineDefaultValue()}
                range={this.props.availableYears}
              />
            )}
          </div>

          <div className="map-panel__area map-panel__sidebar map-panel-can-hide">
            <div className="map-panel__grow map-panel__main-menu" id="right-sidebar-grown-panel">
              <MainMenu
                mode={this.mode}
                iframe={this.props.iframe}
                myMapsPage={this.props.myMapsPage}
                onModeChange={this.handleModeChange.bind(this)}
                calcMaxHeight={() => (
                  $('#right-sidebar-grown-panel').height() - 55
                )}
                coveragePanel={(
                  <CoverageMenu
                    {...this.props}
                    myMapsPage={this.props.myMapsPage}
                    territory={this.territory}
                    map={this.state.selectedMap}
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
                    transitionsLoad={this.loadTransitions.bind(this)}
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

              {this.props.myMapsPage && this.state.selectedMap && (
                <div className="map-panel__action-panel map-panel__action-panel--embed-code">
                  <i id="embed-code-tooltip"
                    className="material-icons tooltip">
                    &#xE86F;
                  </i>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
