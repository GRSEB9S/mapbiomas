import React from 'react';
import classNames from 'classnames';

export const X = React.createClass({
  render() {
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <title>
          switch-x
        </title>
        <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fill-rule="evenodd"/>
      </svg>
    )
  }
});

export const Check = React.createClass({
  render() {
    return (
      <svg width="14" height="11" viewBox="0 0 14 11" xmlns="http://www.w3.org/2000/svg">
        <title>
          switch-check
        </title>
        <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fill-rule="evenodd"/>
      </svg>
    )
  }
});


export default React.createClass({
  displayName: 'Toggle',

  propTypes: {
    checked: React.PropTypes.bool,
    defaultChecked: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    toggleColor: React.PropTypes.string,
    id: React.PropTypes.string,
    'aria-labelledby': React.PropTypes.string,
    'aria-label': React.PropTypes.string
  },

  getInitialState() {
    var checked = false;
    if ('checked' in this.props) {
      checked = this.props.checked
    } else if ('defaultChecked' in this.props) {
      checked = this.props.defaultChecked
    }
    return {
      checked: !!checked,
      hasFocus: false
    }
  },

  componentWillReceiveProps(nextProps) {
    if ('checked' in nextProps) {
      this.setState({checked: !!nextProps.checked})
    }
  },

  handleClick(event) {
    var checkbox = this.refs.input;
    if (event.target !== checkbox)
    {
      event.preventDefault()
      checkbox.focus()
      checkbox.click()
      return
    }

    if (!('checked' in this.props)) {
      this.setState({checked: checkbox.checked})
    }
  },

  handleFocus() {
    this.setState({hasFocus: true})
  },

  handleBlur() {
    this.setState({hasFocus: false})
  },

  render() {
    var classes = classNames('react-toggle', {
      'react-toggle--checked': this.state.checked,
      'react-toggle--focus': this.state.hasFocus,
      'react-toggle--disabled': this.props.disabled
    })

    let toggleStyle = {
      backgroundColor: (this.state.checked ? this.props.toggleColor : '')
    }

    return (
      <div className={classes} onClick={this.handleClick}>
        <div className="react-toggle-track" style={toggleStyle}>
          <div className="react-toggle-track-check">
            <Check />
          </div>
          <div className="react-toggle-track-x">
            <X />
          </div>
        </div>
        <div className="react-toggle-thumb"></div>

        <input
          ref="input"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="react-toggle-screenreader-only"
          type="checkbox"
          {...this.props} />
      </div>
    )
  }
});
