import React, { Component } from 'react';
import className from 'classnames';
import Toggle from 'react-toggle';

export default class Collapsible extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: false,
      checked: false
    }
  }

  handleClick() {
    this.setState({
      opened: !this.state.opened
    })
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked
    })
  }

  hasContent() {
    const content = this.props.content
    return !((content === undefined) || (content.length === 0))
  }

  renderExpandBox() {
    if (this.hasContent()) {
      return (this.state.opened ? "[-] " : "[+] ")
    }
    return ""
  }

  renderToggle() {
    if (!this.hasContent()) {
      return (<Toggle
                className='custom-toggle mini-toggle'
                defaultChecked={false}
                icons={false}
                onChange={this.handleCheck.bind(this)} />)
    }
  }

  renderTitle() {
    return `${this.renderExpandBox()} ${this.props.title}`
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
        {this.state.opened && this.props.children}
      </div>
    )
  }
}
