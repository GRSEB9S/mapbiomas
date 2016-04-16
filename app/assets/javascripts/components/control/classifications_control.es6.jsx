class ClassificationsControl extends React.Component {
  get ids() {
    return this.props.classifications.map((c) => c.id);
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let ids = this.ids;
      ids.push(id);
      this.props.onChange(ids);
    } else if(!e.target.checked && this.isChecked(id)) {
      let ids = _.without(this.ids, id);
      this.props.onChange(ids);
    }
  }

  componentDidMount() {
    $('#classifications-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.tooltip'))
    });
  }

  render() {
    let classificationsNodes = this.props.availableClassifications.map((classification) => {
      return (
        <li key={classification.id} className="classification-item">
          <label>{classification.name}</label>
          <Toggle
            toggleColor={classification.color}
            defaultChecked={this.isChecked(classification.id)}
            onChange={this.handleCheck.bind(this, classification.id)} />
        </li>
      );
    });

    return (
      <div className="classifications-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.classifications')}
          <i id="classifications-tooltip"
            className="material-icons tooltip">
            &#xE88E;
          </i>
        </h3>
        <div className="map-control__content">
          <ul className="classifications-list">
            {classificationsNodes}
          </ul>
        </div>
      </div>
    );
  }
}
