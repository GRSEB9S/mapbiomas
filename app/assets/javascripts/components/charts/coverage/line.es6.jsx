import React, { Component } from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';
import { API } from '../../../lib/api';

const INFRA_BUFFER_OPTIONS = {
  '5k': 5000,
  '10k': 10000,
  '20k': 20000
}
const INFRA_MENU_OPTION = 3;

const parseArea = (area) => {
  let y = parseFloat(area);

  if(isNaN(y)) {
    y = 0;
  }

  return y;
};

class CoverageLineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: []
    };
  }

  get chartOptions() {
    const el = this.refs.chartElement;

    return {
      chart: {
        renderTo: el,
        type: 'line',
        spacingLeft: 0,
        spacingRight: 20
      },
      plotOptions: {
        series: {
          pointStart: _.first(this.props.availableYears)
        }
      },
      yAxis: {
        title: false
      },
      legend: false,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>',
        valueSuffix: ' ha',
        valueDecimals: 2
      },
      exporting: {
        enabled: false
      },
      title: false,
      series: this.state.coverage
    };
  }

  parseCoverage(coverage) {
    return _.chain(coverage)
    .reject((c) => c.id == 28)
    .groupBy('id')
    .map((group) => {
      const classification = this.findCoverageClassification(group[0]);

      return {
        name: classification.name,
        color: classification.color,
        data: _.chain(group)
        .sortBy('year')
        .map(({ area }) => parseArea(area))
        .value()
      };
    })
    .toArray()
    .value();
  }

  loadCoverage(props) {
    this.chart.showLoading();

    let territoryId, promise;

    if (_.isArray(props.territory)) {
      territoryId = props.territory.map((t) => t.id).join(',');
    } else {
      territoryId = props.territory.id
    }

    if (this.props.viewOptionsIndex == INFRA_MENU_OPTION && props.showInfraStats) {
      let levelId = props.infraLevels.map((t) => t.id).join(',');

      promise = API.infraCoverage({
        territory_id: territoryId,
        level_id: levelId,
        buffer: INFRA_BUFFER_OPTIONS[props.infraBuffer.value]
      });
    } else if (props.showCarStats) {
      promise = API.carCoverage({
        territory_id: territoryId
      });
    } else {
      promise = API.coverage({
        territory_id: territoryId,
        classification_ids: props.defaultClassifications.map((c) => c.id).join(',')
      });
    }

    promise.then((coverage) => {
      this.setState({ coverage: this.parseCoverage(coverage) }, () => {
        this.drawChart();
        this.chart.hideLoading();
      });
    });
  }

  componentDidMount() {
    this.drawChart();
    this.loadCoverage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(this.props.year, nextProps.year) ||
      !_.isEqual(this.props.territory, nextProps.territory) ||
      (this.props.showInfraStats && !nextProps.showInfraStats) ||
      (nextProps.showInfraStats && !_.isEmpty(nextProps.infraLevels) && nextProps.infraBuffer.value != 'none') ||
      (this.props.showCarStats != nextProps.showCarStats)
    ) {
      this.loadCoverage(nextProps)
    }
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  findCoverageClassification(coverageItem) {
    return this.props.availableClassifications.find((classification) => (
      classification.id === coverageItem.id
    ));
  }

  render() {
    return (
      <div className="map-panel__item-content">
        <div className="coverage-chart" ref="chartElement"></div>
      </div>
    );
  }
}

export default CoverageLineChart;
