class TransitionsChart extends React.Component {
  get categories() {
    return [this.props.years[0], this.props.years[1]];
  }

  get series() {
    let classifications = new Classifications(this.props.availableClassifications);
    var series = this.props.coverages
      .reduce((series, coverage) => {
        let classification = classifications.findById(coverage.id);
        let serie = series[classification.id] || {
          name: classification.name,
          color: classification.color,
          data: []
        };

        series[classification.id] = serie;
        return series;
      }, {});

    return Object.keys(series).map((k) => {
      let serie = series[k];
      serie.data = this.categories.map((c) => {
        let coverage = this.props.coverages.find((coverage) => {
          return coverage.year === c && coverage.id == k;
        });
        if(coverage) {
          return coverage.area;
        } else {
          return 0;
        }
      })
      return serie;
    });
  }

  get options() {
    let el = this.refs.element;
    return {
      chart: {
        renderTo: el,
        type: 'column',
        spacingLeft: 0,
        spacingRight: 0
      },
      title: false,
      yAxis: {
        labels: {
          enabled: false,
        },
        title: false
      },
      tooltip: {
        pointFormat: '{series.name}: {point.y:,.0f} ha'
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      exporting: { enabled: false },
      series: this.series,
      xAxis: {
        categories: this.categories
      }
    };
  }

  draw() {
    this.chart = new Highcharts.Chart(this.options);
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(this.props, prevProps)) {
      this.draw();
    }
  }

  render() {
    return <div ref="element" className="transitions-chart chart"></div>;
  }
}
