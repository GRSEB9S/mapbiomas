import React from 'react';
import _ from 'underscore';
import { API } from '../../lib/api';
import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);

const formatNumber = (number) => {
  if (_.isNumber(number)) {
    return number
    .toFixed(2)
    .replace(".", ",")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
  }
}

export default class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  get chartSeries() {
    if (_.isEmpty(this.state.data)) {
      return [];
    }

    if (!this.props.myMapsPage && this.props.territories.length > 1) {
      return this.props.territories.map(t => {
        return {
          name: t.label,
          data: this.props.years.map(y => {
            const d = _.find(this.state.data, { year: y, territory: t.value });
            if(d && _.isNumber(d.area)) return d.area;
            return null;
          })
        };
      });
    } else {
      if (_.some(this.state.data, _.isArray)) {
        let data = this.props.classifications.map(c => {
          return this.state.data.map(data => {
            return {
              name: c.label,
              color: c.color,
              data: this.props.years.map(y => {
                const d = _.find(data, { year: y, id: c.value });
                if(d && _.isNumber(d.area)) return d.area;
                return null;
              })
            };
          });
        });

        return _.flatten(data);
      } else {
        return this.props.classifications.map(c => {
          return {
            name: c.label,
            color: c.color,
            data: this.props.years.map(y => {
              const d = _.find(this.state.data, { year: y, id: c.value });
              if(d && _.isNumber(d.area)) return d.area;
              return null;
            })
          };
        });
      }
    }
  }

  get chartOptions() {
    const series = this.chartSeries;
    const el = this.refs.chartElement;
    let title;

    if (this.props.selectedMap) {
      title = this.props.selectedMap.name;
    } else {
      title = this.props.territories.map(t => t.label).join(', ');
    }

    this.setState({ series });

    return {
      chart: {
        renderTo: el
      },
      title: {
        text: title
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

  loadStatistics() {
    this.chart.showLoading();

    let params = {
      territory_id: this.props.territories.map(t => t.value).join(','),
      classification_id: this.props.classifications.map((c) => c.value).join(',')
    };

    if (this.props.myMapsPage) {
      params = { ...params, grouped: true };
    }

    this.props.collectionFunction(params).then(data => this.setState({ data }, () => {
      this.chart.hideLoading();
    }));
  }

  startDownload() {
    window.location.href = this.props.downloadUrl;
  }

  drawChart() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  componentDidMount() {
    this.drawChart();
    this.loadStatistics();
  }

  componentDidUpdate(prevProps, prevState) {
    if(!_.isEqual(prevProps, this.props)) {
      this.loadStatistics();
    }
    if(!_.isEqual(prevState.data, this.state.data)) {
      this.drawChart();
    }
  }

  render() {
    const { series } = this.state;

    return (
      <div className="stats__chart-and-table">
        <div className="stats__chart" ref="chartElement" />
        { series && (
          <div className="stats-table">
            <button className="map-modal__download primary" onClick={this.startDownload.bind(this)}>
              {I18n.t('stats.table.download')}
            </button>

            <table>
              <thead>
                <tr>
                  {this.props.territories.length > 1 && this.props.classifications.length == 1 ?
                    <th>{I18n.t('stats.territories.title')}</th> :
                    <th>{I18n.t('stats.classifications.title')}</th>
                  }
                  {this.props.years.map((year) => (
                    <th key={year}>{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {_.map(series, (serie, i) => (
                  <tr key={i}>
                    <td>{serie.name}</td>
                    {_.map(serie.data, (area, j) => {
                      if (_.isNumber(area)) {
                        return <td key={j}>{formatNumber(area)} ha</td>
                      } else {
                        return <td key={j}></td>
                      }
                    })}
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
