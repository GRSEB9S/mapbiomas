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
    console.log(this.state.coverage);
    let data = this.state.coverage.map((coverageItem) => {
      let classificationName = this.props.classifications.find((classification) => {
        return classification.id === coverageItem.id;
      }).name;
      return {
        y: coverageItem.area,
        name: classificationName
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
      let classificationName = this.props.classifications.find((classification) => {
        return classification.id === coverageItem.id;
      }).name;
      return (
        <li key={coverageItem.id}>
          {classificationName} {coverageItem.area} ha ({coverageItem.percentage}%)
        </li>
      )
    });

    return (
      <div className="coverage">
        <div className="coverage-chart chart"
          style={{height: '128px', width: '40%', display: 'inline-block'}}
          ref="chartElement"></div>
        <ul style={{width: '60%', display: 'inline-block', 'vertical-align': 'top'}}>{coverageClassifications}</ul>
      </div>
    );
  }

  render() {
    return (
      <div className="map-control">
        <h3 className="map-control__header">
          Análise de cobertura
        </h3>
        <div className="map-control__content">
          <label>busque uma cidade, estado, areas protegidas, biomas, etc...</label>
          <Select
            name="territory-select"
            value={this.territoryId}
            options={this.territoriesOptions}
            onChange={this.territoryChange.bind(this)}
            clearable={false}
          />
          {this.renderCoverage()}
          <button className="primary" onClick={this.props.setMode}>
            Analise de transição
          </button>
          <button>Baixe os dados</button>
        </div>
      </div>
    );
  }
}
