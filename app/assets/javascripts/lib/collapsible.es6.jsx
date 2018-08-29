import React, { Component } from 'react';
import className from 'classnames';
import Toggle from 'react-toggle';

const INFRA_BUFFER_OPTIONS = {
  '5k': 'buffer_5k',
  '10k': 'buffer_10k',
  '20k': 'buffer_20k'
};

export default class Collapsible extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  handleClick() {
    this.setState({
      open: !this.state.open
    });
  }

  handleCheck(e) {
    this.props.onChange(e, this.props.category);
  }

  hasContent() {
    const content = this.props.content;

    return !((content === undefined) || (content.length === 0));
  }

  renderExpandBox() {
    if (this.hasContent()) {
      return (this.state.open ? "[-] " : "[+] ")
    }

    return "";
  }

  renderToggle() {
    if (!this.hasContent()) {
      let options = {
        className: 'custom-toggle mini-toggle',
        checked: _.includes(this.props.infraLevels, this.props.category),
        icons: false
      };
      let bufferOption = INFRA_BUFFER_OPTIONS[this.props.infraBuffer];

      if (this.props.infraBuffer != 'none' && !this.props.category[bufferOption]) {
        options = {
          ...options,
          disabled: true
        };
      } else {
        options = {
          ...options,
          onChange: this.handleCheck.bind(this)
        };
      }

      return (
        <Toggle {...options} />
      )
    }

    return null;
  }

  renderTitle() {
    return (
      <label>
        {this.renderExpandBox()} {this.props.category.name}
      </label>
    );
  }

  render() {
    return(
      <div>
        <div className='infra-options'>
          <div onClick={this.handleClick.bind(this)} className="collapsible pointer">
            {this.renderTitle()}
          </div>
          {this.renderToggle()}
        </div>
        {this.state.open && this.props.children}
      </div>
    )
  }
}
