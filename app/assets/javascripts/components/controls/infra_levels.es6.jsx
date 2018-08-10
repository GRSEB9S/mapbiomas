import React, { Component } from 'react';
import classNames from 'classnames';

export default class InfraLevelsControl extends Component {

  mockData() {
    return (
      [
        {
          "id": 1,
          "name": "Transporte",
          "categoria": 1,
          "parent_id": 0,
          "sub": [
            {
              "id": 3,
              "name": "Aquaviário",
              "categoria": 2,
              "parent_id": 1,
              "sub": [
                {
                  "id": 10,
                  "name": "Porto",
                  "categoria": 3,
                  "parent_id": 3,
                  "sub": []
                }
              ]
            }
          ]
        },
        {
          "id": 2,
          "name": "Energia",
          "categoria": 1,
          "parent_id": 0,
          "sub": [
            {
              "id": 5,
              "name": "Combustíveis",
              "categoria": 2,
              "parent_id": 2,
              "sub": [
                {
                  "id": 12,
                  "name": "Bases de Distribuição",
                  "categoria": 3,
                  "parent_id": 5,
                }
              ]
            }
          ]
        }
      ]
    )
  }

  renderOtherSubCategory(props) {
    return (
      <ul className='list-unstyled infra-levels__sub-categories'>
        {props.subCategory.sub.map((otherSubCategory) => {
          this.renderSubCategory(otherSubCategory)
        })}
      </ul>
    )
  }

  renderSubIfExists(subCategory) {
    if (subCategory.sub) {
      console.log(subCategory)
      return <renderOtherSubCategory subCategory={subCategory}/>;
    }
  }

  renderSubCategory(subCategory) {
    return(
      <li className='infra-levels__sub-category'>
        <p>{subCategory.name}</p>
        {this.renderSubIfExists(subCategory)}
      </li>
    )
  }

  renderCategory(category) {
    return(
      <div className="infra_levels__category">
        <p>{category.name}</p>
        <ul className='list-unstyled infra-levels__sub-categories'>
          {category.sub.map((subCategory) => {
            this.renderSubCategory(subCategory)
          })}
        </ul>
      </div>
    )
  }

  consumeData() {
    return (
      <div className="infra-levels">
        {this.mockData().forEach((category) => {
          this.renderCategory(category)
        })}
      </div>
    )
  }

  infraLevels() {
    this.consumeData()
    // {this.props.availableInfraLevels}
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.infraLevels()}
      </div>
    )
  }
}

