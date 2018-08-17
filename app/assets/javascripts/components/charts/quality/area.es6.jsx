import React from 'react';
import _ from 'underscore';
import lodash from 'lodash';
import Highcharts from 'highcharts';

const COLORS = {
  'zero': '#ff0001',
  '1_to_3': '#ffb802',
  '4_to_6': '#fffb03',
  'over_6': '#87c947'
}

class QualityAreaChart extends React.Component {
  constructor(props) {
    super(props);
  }

  get seriesData() {
    return _.map(['over_6', '4_to_6', '1_to_3', 'zero'], (key) => {
      return {
        name: I18n.t(key, {scope: 'map.index.quality.chart'}),
        data: _.map(this.props.qualityData, (d) => d[key]),
        color: COLORS[key]
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
        type: 'area'
      },
      plotOptions: {
        area: {
          stacking: 'normal',
          dataLabels: {
            enabled: false
          }
        }
      },
      xAxis: {
        categories: _.range(1985, 2018)
      },
      yAxis: {
        visible: false
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
      series: this.seriesData
    };
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions());
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
        <div className="quality-chart" ref="chartElement"></div>
      </div>
    );
  }
}

export default QualityAreaChart;
