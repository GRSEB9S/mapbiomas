import React, { Component } from 'react';
import cx from 'classnames';
import scrollbar from 'jquery.scrollbar';

export default class Scrollable extends Component {
  componentDidMount() {
    $(this.refs.content).scrollbar();
  }

  componentWillUnmount() {
    $(this.refs.content).scrollbar('destroy');
  }

  render() {
    const {
      className,
      style,
      scrollContainerClassName,
      scrollContainerStyle,
      children
    } = this.props;
    
    return (
      <div className={className} style={style}>
        <div
          className={cx('scrollbar-dynamic', scrollContainerClassName)}
          style={scrollContainerStyle}
          ref="content"
        >
          {children}
        </div>
      </div>
    );
  }
}
