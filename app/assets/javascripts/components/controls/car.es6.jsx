import React, { Component } from 'react';
import _ from 'underscore';
import Toggle from 'react-toggle';

class CarControl extends Component {
  handleCarLayerChange() {
    this.props.onCarLayerChange();
  }

  render() {
    return (
      <div className="map-panel__content">
        <ul className="toggles-list">
          <li key='car-layer' className="toggle">
            <label>Habilitar camada</label>
            <Toggle
              className='custom-toggle'
              defaultChecked={this.props.showCarLayer}
              icons={false}
              onChange={this.handleCarLayerChange.bind(this)}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default CarControl;
