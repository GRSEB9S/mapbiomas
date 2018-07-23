import React from 'react';
import _ from 'underscore';
import Select from 'react-select';

import { API } from '../../lib/api';
import { Classifications } from '../../lib/classifications';
import { Territories } from '../../lib/territories';

import Chart from './chart';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTerritories: this.selectedTerritories,
      selectedClassifications: this.selectedClassifications
    };
  }

  get collectionOptions() {
    return [
      { value: 'collection3', label: I18n.t('stats.collections.3.title') },
      { value: 'filteredCollection3', label: I18n.t('stats.collections.3.filtered') },
      { value: 'unfilteredCollection3', label: I18n.t('stats.collections.3.unfiltered') },
      { value: 'collection2', label: I18n.t('stats.collections.2') },
      { value: 'allCollections', label: I18n.t('stats.collections.2_and_3') }
    ]
  }

  get collectionsDataFunctions() {
    return {
      'collection2': this.groupedCoverageCollection2,
      'collection3': this.groupedCoverage,
      'filteredCollection3': this.filteredGroupedCoverage,
      'unfilteredCollection3': this.unfilteredGroupedCoverage,
      'allCollections': this.groupedCoverageAllCollections
    }
  }

  get selectedCollection() {
    return this.state.selectedCollection || _.first(this.collectionOptions);
  }

  groupedCoverage(params) {
    return API.groupedCoverage(params);
  }

  filteredGroupedCoverage(params) {
    return API.filteredGroupedCoverage(params);
  }

  unfilteredGroupedCoverage(params) {
    return API.unfilteredGroupedCoverage(params);
  }

  groupedCoverageCollection2(params) {
    return API.groupedCoverageCollection2(params)
  }

  groupedCoverageAllCollections(params) {
    return Promise.all([API.groupedCoverage(params), API.groupedCoverageCollection2(params)]);
  }

  get selectedTerritories() {
    if (this.props.selectedTerritories) {
      if (_.isArray(this.props.selectedTerritories)) {
        return this.props.selectedTerritories;
      }

      return [this.props.selectedTerritories];
    } else {
      return [];
    }
  }

  get selectedClassifications() {
    if (this.props.selectedClassifications) {
      return _.filter(this.classificationsOptions, (c) => {
        return _.contains(this.props.selectedClassifications, c.value)
      })
    } else {
      return [];
    }
  }

  get classificationsOptions() {
    return new Classifications(this.props.classifications).toOptions();
  }

  downloadStatistics(territories) {
    let sortedTerritories = territories.sort((t) => t.id || t.value);

    let params = {
      territory_ids: sortedTerritories.map((t) => t.id || t.value).join(),
      territory_names: sortedTerritories.map((t) => t.name || t.label).join(', '),
      classification_ids: this.state.selectedClassifications.map((c) => c.value).join(',')
    };

    if (this.props.selectedMap) {
      params = {
        ...params,
        grouped: true,
        map_name: this.props.selectedMap.name
      }
    }

    return Routes.download_statistics_path(params);
  }

  onTerritoryChange(selectedTerritories) {
    this.setState({ selectedTerritories });
  }

  onClassificationChange(selectedClassifications) {
    this.setState({ selectedClassifications });
  }

  onCollectionChange(selectedCollection) {
    this.setState({ selectedCollection });
  }

  loadTerritories() {
    return (input, callback) => {
      clearTimeout(this.timeoutId);

      if (input) {
        this.timeoutId = setTimeout(() => {
          API.territories({
            name: input.toUpperCase()
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

  componentDidMount() {
    $('#territories-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('stats.territories.tooltip'))
    });

    $('#classifications-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('stats.classifications.tooltip'))
    });
  }

  renderCharts() {
    if (!_.isEmpty(this.state.selectedTerritories) && !_.isEmpty(this.state.selectedClassifications)) {
      if (!this.props.myMapsPage && this.state.selectedTerritories.length > 1 && this.state.selectedClassifications.length > 1) {
        return this.state.selectedTerritories.map((territory, i) =>
          <Chart
            key={i}
            years={this.props.years.sort()}
            territories={[territory]}
            classifications={this.state.selectedClassifications}
            collectionFunction={this.collectionsDataFunctions[this.selectedCollection.value]}
            downloadUrl={this.downloadStatistics([territory])}
          />
        );
      } else {
        return (
          <Chart
            myMapsPage={this.props.myMapsPage}
            selectedMap={this.props.selectedMap}
            years={this.props.years.sort()}
            territories={this.state.selectedTerritories}
            classifications={this.state.selectedClassifications}
            collectionFunction={this.collectionsDataFunctions[this.selectedCollection.value]}
            downloadUrl={this.downloadStatistics(this.state.selectedTerritories)}
          />
        );
      }
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    let newState = {};

    if (!_.isEmpty(this.props.selectedTerritories)) {
      newState['selectedTerritories'] = prevProps.selectedTerritories;
    }

    if (!_.isEmpty(this.props.selectedClassifications)) {
      newState['selectedClassifications'] = prevProps.selectedClassifications;
    }

    if (!_.isEmpty(newState)) {
      this.setState(newState);
    }
  }

  render() {
    return (
      <div className="page__container">
        <h1 className="page__title">{I18n.t('stats.title')}</h1>
        {I18n.t('stats.subtitle')}

        <div className="stats">
          <div className="stats__filter-box">
            <div className="stats__filter">
              <label className="stats__label">
                {I18n.t('stats.territories.title')}
                <i id="territories-tooltip"
                  className="material-icons tooltip">
                  &#xE88E;
                </i>
              </label>

              <Select.Async
                name="territory-select"
                value={this.state.selectedTerritories}
                loadOptions={this.loadTerritories()}
                onChange={this.onTerritoryChange.bind(this)}
                clearable={false}
                ignoreAccents={false}
                noResultsText={false}
                searchingText={I18n.t('stats.index.searching')}
                multi={true}
              />
            </div>
            <div className="stats__filter">
              <label className="stats__label">
                {I18n.t('stats.classifications.title')}
                <i id="classifications-tooltip"
                  className="material-icons tooltip">
                  &#xE88E;
                </i>
              </label>

              <Select
                name="class-select"
                value={this.state.selectedClassifications}
                options={this.classificationsOptions}
                onChange={this.onClassificationChange.bind(this)}
                clearable={false}
                ignoreAccents={false}
                noResultsText={false}
                searchingText={I18n.t('stats.index.searching')}
                multi={true}
              />
            </div>
            <div className="stats__filter">
              <label className="stats__label">
                {I18n.t('stats.collections.title')}
              </label>

              <Select
                name="class-select"
                value={this.selectedCollection}
                options={this.collectionOptions}
                onChange={this.onCollectionChange.bind(this)}
                clearable={false}
              />
            </div>
          </div>
          <div className="stats__chart-container">
            {this.renderCharts()}
          </div>
        </div>
      </div>
    );
  }
}
