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

  render() {
    return(
      <div>
        <div onClick={this.handleClick.bind(this)} className="collapsible">
          {this.props.title}
        </div>
        {this.state.opened && this.props.children}
      </div>
    )
  }
}
