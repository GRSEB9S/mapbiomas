import React, { Component } from 'react';
import className from 'classnames';
import Toggle from 'react-toggle';

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

      if (this.props.infraBuffer.value != 'none' && !this.props.category[this.props.infraBuffer.option]) {
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
