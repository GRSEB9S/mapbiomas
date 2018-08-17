import React from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';

class QualityPieChart extends React.Component {
  constructor(props) {
    super(props);
  }

  get seriesData() {
    let data = this.props.qualityData[this.props.year];

    return _.map(data, (value, key) => {
      return {
        name: I18n.t(key, {scope: 'map.index.quality.chart'}),
        y: value
      };
    });
  }

  get chartSeries() {
    return (
      [
        {
          name: I18n.t('map.index.quality.chart.tooltip'),
          data: this.seriesData
        }
      ]
    );
  }

  chartOptions() {
    let el = this.refs.chartElement;

    return {
      chart: {
        renderTo: el,
        type: 'pie'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          },
          colors: ['#ff0001', '#ffb802', '#fffb03', '#87c947']
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>'
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      title: false,
      series: this.chartSeries
    };
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions());
  }

  /*componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.qualities, nextProps.qualities)) {
      this.chart.showLoading();
    }
  }*/

  componentDidUpdate(prevProps, prevState) {
    window.setTimeout(() => {
      if(!_.isEqual(this.props.year, prevProps.year)) {
        this.drawChart();
      }
    }, 200)
  }

  componentDidMount() {
    this.drawChart();

    $('#quality-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.warning.quality.body'))
    });
  }

  render() {
    return (
      <div className="map-panel__item-content">
        <h3 className="map-control__header">
          {I18n.t('map.index.quality.analysis')}
          <i id="quality-tooltip" className="material-icons tooltip">
            &#xE88E;
          </i>
        </h3>
        <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
        <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
        <div className="quality-chart" ref="chartElement"></div>
      </div>
    );
  }
}

export default QualityPieChart;
