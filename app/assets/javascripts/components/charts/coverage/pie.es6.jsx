import React, { Component } from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';
import { API } from '../../../lib/api';

class CoveragePieChart extends Component {
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

    API.coverage({
      territory_id: props.territory.id,
      classification_ids: props.defaultClassifications.map((c) => c.id).join(','),
      year: props.year
    }).then((coverage) => {
      this.setState({ coverage: coverage }, () => {
        this.drawChart();
        this.chart.hideLoading();
      });
    })
  }

  componentDidMount() {
    this.drawChart();
    this.loadCoverage();
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.year, nextProps.year) || !_.isEqual(this.props.territory, nextProps.territory)) {
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
        <h3 className="map-control__header">
          {I18n.t('map.index.coverage.analysis')}
        </h3>
        <div className="map-control__content map-control__content-no-max-height">
          <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
          <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
          <label>{I18n.t('map.index.chart.territory', {territory: this.props.territory.name})}</label>
          <div className="coverage-chart" ref="chartElement"></div>
        </div>
      </div>
    );
  }
}

export default CoveragePieChart;
