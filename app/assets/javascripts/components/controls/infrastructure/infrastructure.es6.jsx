import React, { Component } from 'react';
import HierarchyCategory from './hierarchy_category';
import Scrollable from '../../../lib/scrollable';

export default class InfrastructureControl extends Component {

  renderLevels() {
    return (
      <HierarchyCategory
        categories={this.props.availableInfraLevels[0]}
        onChange={this.props.onChange}
      />
    );
  }

  render() {
    return (
      <div className={`${this.props.className} infra-levels`} style={{height: "100%"}}>
        <Scrollable calcMaxHeight={this.props.calcMaxHeight}>
          {this.renderLevels()}
        </Scrollable>
      </div>
    )
  }
}

