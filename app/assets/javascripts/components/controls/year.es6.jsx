import React, { Component } from 'react';
import classNames from 'classnames';
import ReactTimelineSlider from 'react-timeline-slider';

const marginBottomFix = {
  marginBottom: -5
}

class YearControl extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { prevInnerWidth: window.innerWidth }
    this.resizeTimeout;
  }

  componentDidMount() {
    this.onResize = this.onResize.bind(this);
    this.onResizeEnd = this.onResizeEnd.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    $(window).on('resize', this.onResize);    
  }

  componentWillUnmount() {
    $(window).off('resize', this.onResize);
    clearTimeout(this.resizeTimeout);
  }

  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(this.onResizeEnd, 300);
  }

  onResizeEnd() {
    const { prevInnerWidth} = this.state;
    const { innerWidth } = window;

      if (innerWidth != prevInnerWidth) {
      this.resizeTimeout = setTimeout(this.updateWidth, 10);
    }
  }

  updateWidth() {
    this.setState({ prevInnerWidth: innerWidth });
  }

  render() {
    const { className, ...otherProps } = this.props;
    const { prevInnerWidth } = this.state;

    return (
      <div className={classNames('map-panel__action-panel', className)} style={marginBottomFix}>
        <ReactTimelineSlider key={prevInnerWidth} playStop={true} {...otherProps} />
      </div>
    );
  }
}

export default YearControl;
