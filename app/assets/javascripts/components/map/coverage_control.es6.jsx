class CoverageControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      territoryId: null,
      coverage: []
    };
  }

  territoryChange(v) {
    if(v) {
      this.loadTerritoryCoverage(v);
    }
  }

  loadTerritoryCoverage(territoryId) {
    API.coverage({
      territory_id: territoryId,
      classification_ids: this.props.classificationIds,
      year: this.props.year
    }).then((coverage) => {
      this.setState({ territoryId: territoryId, coverage: coverage });
    })
  }

  componentDidMount() {
    this.loadTerritoryCoverage(this.territoryId);
    this.draw();
  }

  draw() {
    this.chart = new Highcharts.Chart(this.chartOptions);
  }

  componentDidUpdate() {
    this.draw();
  }

  findCoverageClassification(coverageItem) {
    return this.props.classifications.find((classification) => {
      return classification.id === coverageItem.id;
    });
  }

  get territoryId() {
    return this.state.territoryId || this.props.defaultTerritory;
  }

  get territoriesOptions() {
    return this.props.territories.map((territory) => {
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

  renderCoverage() {
    let coverageClassifications = this.state.coverage.map((coverageItem) => {
      let classification = this.findCoverageClassification(coverageItem);
      let itemStyle = {
        color: classification.color
      };
      return (
        <li key={coverageItem.id} style={itemStyle}>
          {classification.name} {coverageItem.area} ha ({coverageItem.percentage}%)
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
            value={this.territoryId}
            options={this.territoriesOptions}
            onChange={this.territoryChange.bind(this)}
            clearable={false}
          />
          {this.renderCoverage()}
          <button className="primary" onClick={this.props.setMode}>
            {I18n.t('map.index.transitions_analysis')}
          </button>
          <button>
            {I18n.t('map.index.download')}
          </button>
        </div>
      </div>
    );
  }
}
