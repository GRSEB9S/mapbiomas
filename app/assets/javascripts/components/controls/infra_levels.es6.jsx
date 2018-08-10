import React, { Component } from 'react';

export default class InfraLevelsControl extends Component {

  infraLevels() {
    debugger
    {this.props.availableInfraLevels}
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.infraLevels()}
      </div>
    )
  }
}
