import React from 'react';
import _ from 'underscore';
import { API } from '../../lib/api';
import { Territories } from '../../lib/territories';
import Select from 'react-select';
import Chart from './chart';

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTerritories: [],
      selectedClassifications: []
    };
  }

  onTerritoryChange(selectedTerritories) {
    this.setState({ selectedTerritories })
  }

  onClassificationChange(selectedClassifications) {
    this.setState({ selectedClassifications })
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

  getClassificationsOptions() {
    return this.props.classifications.map(c => ({
      label: c.name,
      color: c.color,
      value: c.id
    }));
  }

  renderCharts() {
    if(this.state.selectedTerritories.length > 1 && this.state.selectedClassifications.length > 1) {
      return this.state.selectedTerritories.map((territory, i) =>
        <Chart
          key={i}
          years={this.props.years.sort()}
          territories={[territory]}
          classifications={this.state.selectedClassifications}
        />
      );
    } else {
      return (
        <Chart
          years={this.props.years.sort()}
          territories={this.state.selectedTerritories}
          classifications={this.state.selectedClassifications}
        />
      );
    }
  }

  render() {
    return (
      <article className="page">
        <div className="page__container">
          <h1 className="page__title">{I18n.t('stats.title')}</h1>
         
          <div className="stats">
            <div className="stats__filter-box">
              <div className="stats__filter">
                <label>{I18n.t('stats.territories')}</label>
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
                <label>{I18n.t('stats.classifications')}</label>
                <Select
                  name="class-select"
                  value={this.state.selectedClassifications}
                  options={this.getClassificationsOptions()}
                  onChange={this.onClassificationChange.bind(this)}
                  clearable={false}
                  ignoreAccents={false}
                  noResultsText={false}
                  searchingText={I18n.t('stats.index.searching')}
                  multi={true}
                />
              </div>
            </div>
            <div className="stats__chart-container">
              {this.renderCharts()} 
            </div>
          </div>
        </div>
      </article>
    );
  }
}
