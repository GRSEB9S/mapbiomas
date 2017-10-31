import React from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';

class QualityChart extends React.Component {
  constructor(props) {
    super(props);
  }

  get seriesData() {
    return this.props.qualityInfo.map(qi => {
      const count = _.filter(this.props.qualities, { quality: Number(qi.api_name) }).length;
      return {
        name: qi.label,
        y: count,
        color: qi.color
      };
    });
  }

  get chartSeries() {
    if (_.isEmpty(this.props.qualities)) {
      return [];
    }

    return (
      [
        {
          name: I18n.t('map.index.quality.chart.tooltip'),
          data: this.seriesData,
        }
      ]
    );
  }

  chartOptions() {
    let el = this.refs.chartElement;
    let colors = _.map(this.props.qualityInfo, (q) => { return q.color });

    return {
      chart: {
        renderTo: el,
        type: 'pie'
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          }
        },
      },
      tooltip: {
        valueSuffix: ' ({point.percentage:.2f}%)</b>'
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

  handleDownloadButton() {
    window.open(this.props.qualityDataUrl, '_blank');
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions());
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.qualities, nextProps.qualities)) {
      this.chart.showLoading();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    window.setTimeout(() => {
      if(!_.isEqual(this.props.qualities, prevProps.qualities)) {
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
        {/*<button
          className="primary"
          onClick={this.handleDownloadButton.bind(this)}
        >
          {I18n.t('map.index.quality.download')}
        </button>*/}
      </div>
    );
  }
}

export default QualityChart;
