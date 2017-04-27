import React, { Component } from 'react';
import cx from 'classnames';

const positionRelative = {
  position: 'relative',
  zIndex: 1
};

class ZoomAndOpacityControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { showOpacityDropdown: false };
  }

  toggleOpacityDropdown() {
    this.setState({ showOpacityDropdown: !this.state.showOpacityDropdown });
  }

  handleOpacityChange({ target: { value } }) {
    this.props.setOpacity(value / 100);
  }

  render() {
    const { showOpacityDropdown } = this.state;
    const { className, zoomIn, zoomOut, opacity } = this.props;

    return (
      <div className="map-panel__action-panel" style={positionRelative}>
        <button className="button button--primary" onClick={zoomIn}>
          <i className="fa fa-plus" />
        </button>
        <button className="button button--primary" onClick={zoomOut}>
          <i className="fa fa-minus" />
        </button>
        <button
          className={cx('button button--primary', showOpacityDropdown && 'active')}
          onClick={this.toggleOpacityDropdown.bind(this)}
        >
          {I18n.t('map.index.opacity')}
        </button>
        {showOpacityDropdown && (
          <div className="map-panels--zoom-and-opacity-panel--opacity-dropdown">
            <input
              min="0"
              max="100"
              type="range"
              style={{ width: '100%' }}
              value={opacity * 100}
              onChange={this.handleOpacityChange.bind(this)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ZoomAndOpacityControl;
