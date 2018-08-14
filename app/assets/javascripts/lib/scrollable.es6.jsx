import React, { Component } from 'react';
import cx from 'classnames';
import scrollbar from 'jquery.scrollbar';

export default class Scrollable extends Component {
  constructor(props) {
    super(props)

    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.resizeDynamic()
      });
    });
  }

  bindObserver() {
    var config = { attributes: true, childList: true, characterData: true }

    this.observer.observe(this.refs.content, config);
  }

  componentDidMount() {
    this.onResize = this.onResize.bind(this);
    $(window).on('resize', this.onResize);
    $(this.refs.content).scrollbar();
    this.onResize();
    this.bindObserver();
  }

  componentWillUnmount() {
    $(this.refs.content).scrollbar('destroy');
    $(window).off('resize', this.onResize);
  }

  resizeDynamic() {
    if(!this.props.calcMaxHeight) return;
    const maxHeight = this.props.calcMaxHeight();
    this.refs.content.parentNode.style.height = `${maxHeight}px`;
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
        <div ref="content" className={cx('scrollbar-inner')}>
          <div ref="inner">
            {children}
          </div>
        </div>
      </div>
    );
  }
}
