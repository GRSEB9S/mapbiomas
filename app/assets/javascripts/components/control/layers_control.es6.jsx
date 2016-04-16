class LayersControl extends React.Component {
  constructor(props) {
    super(props);
  }

  handleCheck(layer, evt) {
    this.props.onLayerChange(layer, evt.target.checked);
  }

  render() {
    return (
      <div className="classifications-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.layers.title')}
        </h3>
        <div className="map-control__content">
          <ul className="classifications-list">
            <li className="classification-item">
              <label>{I18n.t('map.index.layers.states')}</label>
              <Toggle
                toggleColor="#b3b3b3"
                defaultChecked={this.props.layers.states}
                onChange={this.handleCheck.bind(this, 'states')} />
            </li>
            <li className="classification-item">
              <label>{I18n.t('map.index.layers.cities')}</label>
              <Toggle
                toggleColor="#c8c8c8"
                defaultChecked={this.props.layers.cities}
                onChange={this.handleCheck.bind(this, 'cities')} />
            </li>
            <li className="classification-item">
              <label>{I18n.t('map.index.layers.biomes')}</label>
              <Toggle
                toggleColor="#aaa"
                defaultChecked={this.props.layers.biomes}
                onChange={this.handleCheck.bind(this, 'biomes')} />
            </li>
            <li className="classification-item">
              <label>{I18n.t('map.index.layers.contour_maps')}</label>
              <Toggle
                toggleColor="#aaa"
                defaultChecked={this.props.layers.contourMaps}
                onChange={this.handleCheck.bind(this, 'contourMaps')} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
