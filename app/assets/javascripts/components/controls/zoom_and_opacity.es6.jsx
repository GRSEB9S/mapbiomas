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

  componentDidMount() {
    $('#point-info-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      interactive: true,
      contentAsHTML: true,
      content: $(I18n.t('map.index.point_click'))
    });
  }

  render() {
    const { showOpacityDropdown } = this.state;
    const {
      className,
      enablePointClick,
      hiddenPanels,
      hidePanels,
      opacity,
      pointClick,
      showTutorial,
      zoomIn,
      zoomOut
    } = this.props;

    return (
      <div className="map-panel__action-panel map-panel__action-panel--zoom-and-opacity" style={positionRelative}>
        <button title={I18n.t('map.index.zoom_in')} className="primary" onClick={zoomIn}>
          <i className="fa fa-plus" />
        </button>
        <button title={I18n.t('map.index.zoom_out')} className="primary" onClick={zoomOut}>
          <i className="fa fa-minus" />
        </button>
        <button title={I18n.t('map.index.hide_panels')} className="primary" onClick={hidePanels}>
          <i className="fa fa-eye-slash" />
        </button>
        <button
          title={I18n.t('map.index.opacity_dropdown')}
          className={classNames('primary', showOpacityDropdown && 'active')}
          onClick={this.toggleOpacityDropdown.bind(this)}
        >
          <i className="fa fa-sun-o" />
        </button>
        <button title={I18n.t('map.index.tutorial')} className="primary" onClick={showTutorial}>?</button>
        <button id="point-info-tooltip" className={classNames('primary', pointClick && 'active')} onClick={enablePointClick}>
          <i className="fa fa-binoculars" />
        </button>
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
