class CoverageControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coverage: []
    };
  }

  get territoriesOptions() {
    return this.props.availableTerritories.map((territory) => {
      return {
        label: territory.name,
        value: territory.id
      };
    });
  }

  get chartSeries() {
    let data = this.state.coverage.map((coverageItem) => {
      let classification = this.findCoverageClassification(coverageItem);
      return {
        y: coverageItem.area,
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
        type: 'pie'
      },
      tooltip: false,
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false
          },
        }
      },
      exporting: { enabled: false },
      title: false,
      series: this.chartSeries
    };
  }

  loadCoverage(props) {
    API.coverage({
      territory_id: props.territory.id,
      classification_ids: props.classifications.map((c) => c.id).join(','),
      year: props.year
    }).then((coverage) => {
      this.setState({ coverage: coverage }, () => {
        this.draw()
      });
    })
  }

  componentDidMount() {
    this.loadCoverage(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props, nextProps)) {
      this.loadCoverage(nextProps)
    }
  }

  draw() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  findCoverageClassification(coverageItem) {
    return this.props.availableClassifications.find((classification) => {
      return classification.id === coverageItem.id;
    });
  }

  download() {
    let rows = [["Classificação", "Área", "Porcentagem sobre área total"]];
    this.state.coverage.forEach((coverageItem) => {
      let classification = this.findCoverageClassification(coverageItem);
      rows.push([classification.name, coverageItem.area, coverageItem.percentage]);
    });

    XLSXUtils.arrayToXLSX(`Cobertura-${this.props.territory.name}-${this.props.year}`, rows);
  }

  renderCoverage() {
    let coverageClassifications = this.state.coverage.map((coverageItem) => {
      let classification = this.findCoverageClassification(coverageItem);
      let itemStyle = {
        color: classification.color
      };
      return (
        <li key={coverageItem.id} style={itemStyle}>
          <span className="coverage-label">{classification.name}</span>
          <span className="coverage-value">
            {coverageItem.area} ha ({coverageItem.percentage}%)
          </span>
        </li>
      )
    });

    return (
      <div className="coverage">
        <div className="coverage-chart chart" ref="chartElement"></div>
        <ul className="coverage-legend">{coverageClassifications}</ul>
      </div>
    );
  }

  render() {
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
            options={this.territoriesOptions}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
          {this.renderCoverage()}
          <button onClick={this.download.bind(this)}>
            {I18n.t('map.index.download')}
          </button>
          <button className="primary" onClick={this.props.setMode}>
            {I18n.t('map.index.transitions_analysis')}
          </button>
        </div>
      </div>
    );
  }
}
