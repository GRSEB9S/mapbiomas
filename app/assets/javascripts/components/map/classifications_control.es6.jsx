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

  slugifyClassification(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length ; i < l ; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  componentDidMount() {
    $('#classifications-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.tooltip'))
    });
  }

  render() {
    let classificationsNodes = this.props.availableClassifications.map((classification) => {
      let itemStyle = {
        color: classification.color
      }
      return (
        <li key={classification.id} className="classification-item">
          <label style={itemStyle}>{classification.name}</label>
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
