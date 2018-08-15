import React, { Component } from 'react';
import className from 'classnames';
import Collapsible from "lib/collapsible";

export default class HierarchyCategory extends Component {

  renderSub(sub) {
    if (sub) {
      return <HierarchyCategory categories={sub}/>
    }
  }

  subCategory(category) {
    if (typeof category.sub === undefined) {
      return []
    }
    return category.sub
  }

  renderCategory(category) {
    return(
      <li className="infra_levels__category content">
        <Collapsible content={this.subCategory(category)} title={category.name}>
          {this.renderSub(category.sub)}
        </Collapsible>
      </li>
    )
  }

  renderList() {
    return this.props.categories.map((category) => {
      return this.renderCategory(category)
    })
  }

  render() {
    return(
      <ul>
        { this.renderList() }
      </ul>
    )
  }
}
