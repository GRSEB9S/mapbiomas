import React from 'react';
import _ from 'underscore';
import { API } from '../../lib/api';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

const formatNumber = (number) => (
  number
  .toFixed(2)
  .replace(".", ",")
  .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
);

export default class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    Highcharts.setOptions({
      lang: {
        contextButtonTitle: I18n.t('charts.buttons.context_button.title'),
        downloadJPEG: I18n.t('charts.lang.download_jpeg'),
        downloadPDF: I18n.t('charts.lang.download_pdf'),
        downloadPNG: I18n.t('charts.lang.download_png'),
        downloadSVG: I18n.t('charts.lang.download_svg'),
        printChart: I18n.t('charts.lang.print_chart')
      }
    });

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
      classification_id: this.props.classifications.map((c) => c.value).join(',')
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
      return this.props.classifications.map(c => {
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
    const series = this.buildSeries();
    this.setState({ series });

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
      series: series,
      xAxis: {
        categories: this.props.years
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            text: I18n.t('charts.buttons.context_button.text')
          }
        }
      }
    };
  }

  render() {
    const { series } = this.state;

    return (
      <div className="stats__chart-and-table">
        <div className="stats__chart" ref="chart" />
        { series && (
          <div className="stats-table">
            <table>
              <thead>
                <tr>
                  <th>Classes</th>
                  {this.props.years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {_.map(series, (serie, i) => (
                  <tr key={i}>
                    <td>{serie.name}</td>
                    {_.map(serie.data, (area, j) => (
                      <td key={j}>{formatNumber(area)} ha</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
