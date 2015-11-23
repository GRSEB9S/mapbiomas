class TransitionsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      transitions: [],
      coverages: []
    };
  }

  loadTransitions(props) {
    API.transitions({
      territory_id: props.territory.id,
      year: props.years.join(',')
    }).then((transitions) => {
      this.setState(transitions);
    })
  }

  componentDidMount() {
    this.loadTransitions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props, nextProps)) {
      this.loadTransitions(nextProps)
    }
  }

  renderTransitions() {
    let classifications = new Classifications(this.props.matrixClassifications);
    let transitions = this.state.transitions;
    let nodes = transitions.reduce((memo, transition) => {
      let from = classifications.findById(transition.from);
      let to = classifications.findById(transition.to);
      return memo.concat([
        {
          name: from.name,
          id: from.id,
          type: 'from',
          color: from.color
        },
        {
          name: to.name,
          id: to.id,
          color: to.color,
          type: 'to'
        }
      ]);
    }, []);

    nodes = _.uniq(nodes, (n) => `${n.type}->${n.name}`);

    let links = transitions.map((transition) => {
      let fromIndex = _.findIndex(nodes, (n) => {
        return n.id == transition.from && n.type == 'from';
      });
      let toIndex = _.findIndex(nodes, (n) => {
        return n.id == transition.to && n.type == 'to';
      });

      return {
        source: fromIndex,
        target: toIndex,
        value: transition.area
      };
    });

    return (
      <ul className="transitions-legend">
        <li><label>{this.props.years.join('-')}</label></li>
        <li>
          <TransitionsChart
            transition={this.props.transition || this.state.transitions[0]}
            setTransition={this.props.setTransition}
            nodes={nodes}
            links={links} />
        </li>
      </ul>
    );
  }

  expandMatrix() {
    this.props.onExpandMatrix(this.state.transitions);
  }

  render() {
    let territories = new Territories(this.props.availableTerritories);
    let controlClass = classNames('map-control', { 'map-control--expanded': this.state.expanded });

    return (
      <div className={controlClass}>
        <div className="tabs map-control__tabs">
          <div className="tabs__item" onClick={this.props.setMode}>
            {I18n.t('map.index.coverage')}
          </div>

          <div className="tabs__item tabs__item--active">
            {I18n.t('map.index.transitions')}
          </div>

          <div className="tabs__item">
            {I18n.t('map.index.quality')}
          </div>
        </div>

        <h3 className="map-control__header">
          {I18n.t('map.index.transitions_analysis')}
        </h3>

        <div className="map-control__content">
          <label>{I18n.t('map.index.search')}</label>
          <Select
            name="territory-select"
            value={this.props.territory.id}
            options={territories.toOptions()}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
          {this.renderTransitions()}
          <button className="primary" onClick={this.expandMatrix.bind(this)}>
            {I18n.t('map.index.transitions_matrix.title')}
          </button>
        </div>
      </div>
    );
  }
}
