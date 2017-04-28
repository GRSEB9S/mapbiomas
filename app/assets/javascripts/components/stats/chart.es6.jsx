import React from 'react';
import _ from 'underscore';
import { API } from '../../lib/api';
import Highcharts from 'highcharts';

export default class Chart extends React.Component {
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
    API.groupedCoverage({
      territory_id: this.props.territories.map(t => t.value).join(','),
      classification_id: this.props.classes.map((c) => c.value).join(',')
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


