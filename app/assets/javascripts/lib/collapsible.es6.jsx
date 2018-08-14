import React, { Component } from 'react';
import className from 'classnames';

export default class Collapsible extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: false
    }
  }

  handleClick() {
    this.setState({
      opened: !this.state.opened
    })
  }

  renderExpandBox() {
    const content = this.props.content
    if (!(content && content.constructor === Array && content.length === 0)) {
      return (this.state.opened ? "[-] " : "[+] ")
    }
    return ""
  }

  renderTitle() {
    return `${this.renderExpandBox()} ${this.props.title}`
  }

  render() {
    return(
      <div>
        <div onClick={this.handleClick.bind(this)} className="collapsible">
          {this.renderTitle()}
        </div>
        {this.state.opened && this.props.children}
      </div>
    )
  }
}
