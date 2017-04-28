import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import { API } from '../../lib/api';
import Highcharts from 'highcharts';
import { Territories } from '../../lib/territories';
import Select from 'react-select';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if(!_.isEqual(prevProps, this.props)) {
      this.fetchData();
    }
    if(!_.isEqual(prevState.data, this.state.data)) {
      this.chart = new Highcharts.Chart(this.refs.chart, this.buildOptions());
    }
  }

  fetchData() {
    API.coverage({
      territory_id: this.props.territories.map(t => t.value).join(','),
      classification_ids: this.props.classes.map((c) => c.value).join(',')
    }).then(data => this.setState({ data }));
  }

  buildSeries() {
    if(this.props.territories.length > 1) {
      return this.props.territories.map(t => {
        return {
          name: t.label,
          data: this.props.years.map(y => {
            const d = _.find(this.state.data, { year: y, territory: t.value });
            if(d && _.isNumber(d.area)) return d.area;
            return 0;
          })
        };
      });
    } else {
      return this.props.classes.map(c => {
        return {
          name: c.label,
          color: c.color,
          data: this.props.years.map(y => {
            const d = _.find(this.state.data, { year: y, id: c.value });
            if(d && _.isNumber(d.area)) return d.area;
            return 0;
          })
        };
      });
    }
  }

  buildOptions() {
    return {
      title: {
        text: this.props.territories.map(t => t.label).join(', ')
      },
      yAxis: {
        title: {
          text: I18n.t('stats.chart.yAxis.title')
        }
      },
      tooltip: {
        valueSuffix: ' ha',
        valueDecimals: 2
      },
      series: this.buildSeries(),
      xAxis: {
        categories: this.props.years
      }
    };
  }

  render() {
    return (
      <div className="stats__chart" ref="chart" />
    );
  }
}

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
