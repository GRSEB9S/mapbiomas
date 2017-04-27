import React, { Component } from 'react';
import cx from 'classnames';
import ReactTimelineSlider from 'react-timeline-slider';

const marginBottomFix = {
  marginBottom: -5
}

class YearControl extends Component {
  render() {
    const { className, ...otherProps } = this.props;
    return (
      <div className={cx('map-panel__action-panel', className)} style={marginBottomFix}>
        <ReactTimelineSlider playStop={true} {...otherProps} />
      </div>
    );
  }
}

export default YearControl;