import React from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';
import Select from 'react-select';
import { API } from '../../lib/api';
import { Territories } from '../../lib/territories';

export class CoverageControl extends React.Component {
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
    let el = this.refs.chartElement;

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
        pointFormat: '<b>' + I18n.t('map.index.coverage') + '</b>: {point.y}',
        valueSuffix: ' ha',
        valueDecimals: 2
      },
      exporting: { enabled: false },
      title: false,
      series: this.chartSeries
    };
  }

  loadCoverage(props) {
    API.coverage({
      territory_id: props.territory.id,
      classification_ids: props.defaultClassifications.map((c) => c.id).join(','),
      year: props.year
    }).then((coverage) => {
      this.setState({ coverage: coverage }, () => {
        this.drawChart()
      });
    })
  }

  componentDidMount() {
    this.loadCoverage(this.props);
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
    let territories = new Territories(this.props.availableTerritories);

    return (
      <div className="map-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.coverage_analysis')}
        </h3>
        <div className="map-control__content">
          <label>{I18n.t('map.index.search')}</label>
          <Select
            name="territory-select"
            value={this.props.territory.id}
            options={territories.toOptions()}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
          <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
          <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
          <div className="coverage-chart" ref="chartElement"></div>
        </div>
      </div>
    );
  }
}
