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

export default class CoveragePieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: []
    };
  }

  get chartSeries() {
    let data = this.state.coverage.map((coverageItem) => {
      let classification = this.findCoverageClassification(coverageItem);
      let y = parseFloat(coverageItem.area);

      if(isNaN(y)) {
        y = 0;
      }

      return {
        y: y,
        name: classification.name,
        color: classification.color
      }
    });

    return [{
      name: 'Coverage',
      data: data
    }];
  }

  get chartOptions() {
    const el = this.refs.chartElement;

    return {
      chart: {
        renderTo: el,
        type: 'pie',
        spacingLeft: 0,
        spacingRight: 0
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          },
          borderColor: '#DDDDDD'
        },
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b>',
        valueSuffix: ' ha',
        valueDecimals: 2
      },
      exporting: {
        enabled: false
      },
      title: false,
      series: this.chartSeries
    };
  }

  loadCoverage(props = this.props) {
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
        buffer: INFRA_BUFFER_OPTIONS[props.infraBuffer.value],
        year: props.year
      });
    } else if (props.showCarStats) {
      promise = API.carCoverage({
        territory_id: territoryId,
        year: props.year
      });
    } else {
      promise = API.coverage({
        territory_id: territoryId,
        classification_ids: props.defaultClassifications.map((c) => c.id).join(','),
        year: props.year
      });
    }

    promise.then((coverage) => {
      this.setState({ coverage: coverage }, () => {
        this.drawChart();
        this.chart.hideLoading();
      });
    });
  }

  componentDidMount() {
    this.drawChart();
    this.loadCoverage();
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
    return this.props.availableClassifications.find((classification) => {
      return classification.id == coverageItem.id;
    });
  }

  render() {
    return (
      <div className="map-panel__item-content">
        <div className="map-control__content map-control__content-no-max-height">
          <div className="coverage-chart" ref="chartElement"></div>
        </div>
      </div>
    );
  }
}
