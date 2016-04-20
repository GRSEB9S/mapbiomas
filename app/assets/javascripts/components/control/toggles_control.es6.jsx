class TogglesControl extends React.Component {
  get ids() {
    return this.props.options.map((c) => c.id);
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
    if(this.props.tooltip) {
      $('#options-tooltip').tooltipster({
        theme: 'tooltip-custom-theme',
        content: $(this.props.tooltip)
      });
    }
  }

  renderTooltip() {
    if(this.props.tooltip) {
      return (
        <i id="options-tooltip"
          className="material-icons tooltip">
          &#xE88E;
        </i>
      );
    }
  }

  render() {
    let options = this.props.availableOptions.map((option) => {
      return (
        <li key={option.id} className="classification-item">
          <label>{option.name}</label>
          <Toggle
            toggleColor={option.color}
            defaultChecked={this.isChecked(option.id)}
            onChange={this.handleCheck.bind(this, option.id)} />
        </li>
      );
    });

    return (
      <div className="map-control">
        <h3 className="map-control__header">
          {this.props.title}
          {this.renderTooltip()}
        </h3>
        <div className="map-control__content">
          <ul className="classifications-list">
            {options}
          </ul>
        </div>
      </div>
    );
  }
}