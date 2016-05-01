import React from 'react';

export class OpacityControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="map-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.opacity')}
        </h3>
        <input type="range" style={{width: '100%'}} value={this.props.opacity}
          onChange={this.props.onChange}
          min="0" max="100" />
      </div>
    );
  }
}
