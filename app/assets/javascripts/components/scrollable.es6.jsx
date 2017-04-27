import React, { Component } from 'react';
import cx from 'classnames';
import scrollbar from 'jquery.scrollbar';

export default class Scrollable extends Component {
  componentDidMount() {
    this.onResize = this.onResize.bind(this);
    $(window).on('resize', this.onResize);
    $(this.refs.content).scrollbar();
    this.onResize();
  }

  componentWillUnmount() {
    $(this.refs.content).scrollbar('destroy');
    $(window).off('resize', this.onResize);
  }

  onResize() {
    if(!this.props.calcMaxHeight) return;

    const maxHeight = this.props.calcMaxHeight();
    const innerHeight = $(this.refs.inner).height();
    const height = Math.min(innerHeight, maxHeight);

    this.refs.content.parentNode.style.height = `${height}px`;
  }

  render() {
    const { className, children, calcMaxHeight } = this.props;

    return (
      <div className={className}>
        <div ref="content" className={cx('scrollbar-dynamic')}>
          <div ref="inner">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
