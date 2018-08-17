import React, { Component } from 'react';
import className from 'classnames';
import Toggle from 'react-toggle';

export default class Collapsible extends Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleClick() {
    this.setState({
      open: !this.state.open
    })
  }

  handleCheck(e) {
    this.props.onChange(e, this.props.category);
  }

  hasContent() {
    const content = this.props.content
    return !((content === undefined) || (content.length === 0))
  }

  renderExpandBox() {
    if (this.hasContent()) {
      return (this.state.open ? "[-] " : "[+] ")
    }
    return ""
  }

  renderToggle() {
    if (!this.hasContent()) {
      return (
        <Toggle
          className='custom-toggle mini-toggle'
          defaultChecked={false}
          icons={false}
          onChange={this.handleCheck.bind(this)}
        />
      )
    }
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
