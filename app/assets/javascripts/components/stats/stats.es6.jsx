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
      selectedClasses: []
    };
  }

  onTerritoryChange(selectedTerritories) {
    this.setState({ selectedTerritories })
  }

  onClassChange(selectedClasses) {
    this.setState({ selectedClasses })
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

  getClassesOptions() {
    return this.props.classes.map(c => ({
      label: c.name,
      color: c.color,
      value: c.id
    }));
  }

  renderCharts() {
    if(this.state.selectedTerritories.length > 1 && this.state.selectedClasses.length > 1) {
      return this.state.selectedTerritories.map((territory, i) =>
        <Chart
          key={i}
          years={this.props.years.sort()}
          territories={[territory]}
          classes={this.state.selectedClasses}
        />
      );
    } else {
      return (
        <Chart
          years={this.props.years.sort()}
          territories={this.state.selectedTerritories}
          classes={this.state.selectedClasses}
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
                <label>{I18n.t('stats.classes')}</label>
                <Select
                  name="class-select"
                  value={this.state.selectedClasses}
                  options={this.getClassesOptions()}
                  onChange={this.onClassChange.bind(this)}
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
