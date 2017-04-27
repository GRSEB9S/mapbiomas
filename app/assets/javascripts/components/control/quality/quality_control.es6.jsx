import React from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';
import Select from 'react-select';

class QualityControl extends React.Component {
  constructor(props) {
    super(props);
    this.qualityNames = {};
  }

  get qualitiesGroupedByCards() {
    let cardsNames = _.map(this.props.cards.features, (c) => c.properties.name);

    let qualities = _.map(cardsNames, (c) =>
      _.findWhere(this.props.qualities, {name: c}) || { name: 'undefined', quality: null });

    let groupedByCount = _.countBy(qualities, (q) => this.qualityNames[q.quality]);

    return _.sortBy(_.pairs(groupedByCount), (quality) =>
      _.findIndex(this.props.qualityInfo, { label: quality[0]}));
  }

  get chartSeries() {
    return (
      [
        {
          name: I18n.t('map.index.quality.chart.tooltip'),
          data: this.qualitiesGroupedByCards,
        }
      ]
    );
  }

  get chartOptions() {
    let el = this.refs.chartElement;
    let colors = _.map(this.props.qualityInfo, (q) => { return q.color });
    let seriesColors = _.map(colors, (c) => {
      return Highcharts.Color(c).setOpacity(0.7).get('rgba');
    });

    return {
      chart: {
        renderTo: el,
        type: 'pie'
      },
      plotOptions: {
        pie: {
          colors: seriesColors,
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

  updateQualityNames(qualities) {
    this.qualityNames = _.reduce(qualities, (names, q) => {
      let quality = String(q.quality);
      names[quality] = _.findWhere(this.props.qualityInfo, {api_name: quality}).label;
      return names;
    }, {});
  }

  handleDownloadButton() {
    window.open(this.props.qualityDataUrl, '_blank');
  }

  renderChart() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  componentDidUpdate(prevProps, prevState) {
    if(!_.isEqual(this.props.qualities, prevProps.qualities)) {
      this.updateQualityNames(this.props.qualities);
      this.renderChart();
    }
  }

  componentDidMount() {
    this.updateQualityNames(this.props.qualities);
    this.renderChart();

    $('#quality-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.warning.quality.body'))
    });
  }

  render() {
    return (
      <div className="map-panel__item-content" style={{ maxHeight: 'auto' }}>
        <h3 className="map-control__header">
          {I18n.t('map.index.quality.analysis')}
          <i id="quality-tooltip" className="material-icons tooltip">
            &#xE88E;
          </i>
        </h3>
        <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
        <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
        <div className="quality-chart" ref="chartElement"></div>
        <button
          className="primary"
          onClick={this.handleDownloadButton.bind(this)}
        >
          {I18n.t('map.index.quality.download')}
        </button>
      </div>
    );
  }
}

export default QualityControl;