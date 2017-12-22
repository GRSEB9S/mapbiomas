import React, { Component } from 'react';
import classNames from 'classnames';

const positionRelative = {
  position: 'relative',
  zIndex: 1
};

class ZoomAndOpacityControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { showOpacityDropdown: true };
  }

  toggleOpacityDropdown() {
    this.setState({ showOpacityDropdown: !this.state.showOpacityDropdown });
  }

  handleOpacityChange({ target: { value } }) {
    this.props.setOpacity(value / 100);
  }

  render() {
    const { showOpacityDropdown } = this.state;
    const { className, zoomIn, zoomOut, opacity, hiddenPanels, hidePanels, showTutorial } = this.props;

    return (
      <div className="map-panel__action-panel map-panel__action-panel--zoom-and-opacity" style={positionRelative}>
        <button className="primary" onClick={zoomIn}>
          <i className="fa fa-plus" />
        </button>
        <button className="primary" onClick={zoomOut}>
          <i className="fa fa-minus" />
        </button>
        <button className="primary" onClick={hidePanels}>
          <i className="fa fa-eye-slash" />
        </button>
        <button
          className={classNames('primary', showOpacityDropdown && 'active')}
          onClick={this.toggleOpacityDropdown.bind(this)}
        >
          <i className="fa fa-sun-o" />
        </button>
        <button className="primary" onClick={showTutorial}>?</button>
        {showOpacityDropdown && !hiddenPanels && (
          <div>
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
