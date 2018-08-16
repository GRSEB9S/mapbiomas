import React from 'react';
import _ from 'underscore';
import Highcharts from 'highcharts';

const QUALITY_DATA = {
  1985: { 'zero': 0.080429422707922,  '1_to_3': 0.333619643805825,  '4_to_6': 0.34477730678809,   'over_6': 0.241173626698162 },
  1986: { 'zero': 0.036790200191337,  '1_to_3': 0.244240391208083,  '4_to_6': 0.328480510835603,  'over_6': 0.390488897764977 },
  1987: { 'zero': 0.027579864800469,  '1_to_3': 0.137421237693064,  '4_to_6': 0.305952072999973,  'over_6': 0.529046824506494 },
  1988: { 'zero': 0.021912329247258,  '1_to_3': 0.186129803357393,  '4_to_6': 0.293513195182502,  'over_6': 0.498444672212847 },
  1989: { 'zero': 0.037330826707378,  '1_to_3': 0.302051346828761,  '4_to_6': 0.36423181255316,   'over_6': 0.2963860139107   },
  1990: { 'zero': 0.041110160297162,  '1_to_3': 0.218297380118022,  '4_to_6': 0.339548368685368,  'over_6': 0.401044090899448 },
  1991: { 'zero': 0.028641664253812,  '1_to_3': 0.172831294578176,  '4_to_6': 0.358779497192288,  'over_6': 0.439747543975724 },
  1992: { 'zero': 0.037903706702556,  '1_to_3': 0.234148881343737,  '4_to_6': 0.397409077464411,  'over_6': 0.330538334489296 },
  1993: { 'zero': 0.035813876669111,  '1_to_3': 0.178490308912109,  '4_to_6': 0.29655217299222,   'over_6': 0.48914364142656  },
  1994: { 'zero': 0.05547062878428,   '1_to_3': 0.257644806600244,  '4_to_6': 0.399142650090379,  'over_6': 0.287741914525097 },
  1995: { 'zero': 0.044515950099054,  '1_to_3': 0.252326367858571,  '4_to_6': 0.39843570346412,   'over_6': 0.304721978578255 },
  1996: { 'zero': 0.033372578936712,  '1_to_3': 0.139811727271194,  '4_to_6': 0.309349674100362,  'over_6': 0.517466019691732 },
  1997: { 'zero': 0.026615601748776,  '1_to_3': 0.221829371423319,  '4_to_6': 0.461475557642903,  'over_6': 0.290079469185002 },
  1998: { 'zero': 0.039805569946992,  '1_to_3': 0.229726718868076,  '4_to_6': 0.443267852516047,  'over_6': 0.287199858668884 },
  1999: { 'zero': 0.02949908378173,   '1_to_3': 0.181375226461059,  '4_to_6': 0.344978401742205,  'over_6': 0.444147288015006 },
  2000: { 'zero': 0.00849719716511,   '1_to_3': 0.209841261307573,  '4_to_6': 0.373216416298262,  'over_6': 0.408445125229055 },
  2001: { 'zero': 0.004710283649087,  '1_to_3': 0.070857248527705,  '4_to_6': 0.263655199317326,  'over_6': 0.660777268505883 },
  2002: { 'zero': 0.005491430621898,  '1_to_3': 0.084024645657603,  '4_to_6': 0.224264602077371,  'over_6': 0.686219321643129 },
  2003: { 'zero': 0.032146623254577,  '1_to_3': 0.28366120004235,   '4_to_6': 0.488491816451704,  'over_6': 0.195700360251369 },
  2004: { 'zero': 0.016050688942966,  '1_to_3': 0.091424370170643,  '4_to_6': 0.238486980565243,  'over_6': 0.654037960321149 },
  2005: { 'zero': 0.024340753086437,  '1_to_3': 0.115333827225758,  '4_to_6': 0.212231307293965,  'over_6': 0.64809411239384  },
  2006: { 'zero': 0.022239242616303,  '1_to_3': 0.137714940603249,  '4_to_6': 0.234401767190315,  'over_6': 0.605644049590133 },
  2007: { 'zero': 0.033254648585337,  '1_to_3': 0.162269278613262,  '4_to_6': 0.232064444459587,  'over_6': 0.572411628341814 },
  2008: { 'zero': 0.033254648585337,  '1_to_3': 0.162269278613262,  '4_to_6': 0.232064444459587,  'over_6': 0.572411628341814 },
  2009: { 'zero': 0.018050768583013,  '1_to_3': 0.14126752742495,   '4_to_6': 0.266060801668718,  'over_6': 0.574620902323319 },
  2010: { 'zero': 0.05203276048818,   '1_to_3': 0.230068881036768,  '4_to_6': 0.286374026392172,  'over_6': 0.43152433208288  },
  2011: { 'zero': 0.049637541571616,  '1_to_3': 0.311543690995762,  '4_to_6': 0.327223227018363,  'over_6': 0.311595540414259 },
  2012: { 'zero': 0.008873868240151,  '1_to_3': 0.14505544329604,   '4_to_6': 0.282830322267993,  'over_6': 0.563240366195817 },
  2013: { 'zero': 0.022485268361638,  '1_to_3': 0.168215152905592,  '4_to_6': 0.273595339805011,  'over_6': 0.535704238927759 },
  2014: { 'zero': 0.01419339297586,   '1_to_3': 0.097353472602414,  '4_to_6': 0.221633372386236,  'over_6': 0.66681976203549  },
  2015: { 'zero': 0.0118756641084,    '1_to_3': 0.069067162008256,  '4_to_6': 0.153819281210617,  'over_6': 0.765237892672726 },
  2016: { 'zero': 0.017145967659701,  '1_to_3': 0.067661745539774,  '4_to_6': 0.188747955643785,  'over_6': 0.726444331156741 },
  2017: { 'zero': 0.01349812367719,   '1_to_3': 0.072304172716803,  '4_to_6': 0.181951686430386,  'over_6': 0.732246017175621 }
};

class QualityPieChart extends React.Component {
  constructor(props) {
    super(props);
  }

  get seriesData() {
    let data = QUALITY_DATA[this.props.year];

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
