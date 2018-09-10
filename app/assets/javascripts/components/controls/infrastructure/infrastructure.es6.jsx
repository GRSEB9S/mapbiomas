import React, { Component } from 'react';
import HierarchyCategory from './hierarchy_category';
import Scrollable from '../../../lib/scrollable';
import Select from 'react-select';
import Toggle from 'react-toggle';

export default class InfrastructureControl extends Component {
  renderLevels() {
    return (
      <HierarchyCategory
        infraLevels={this.props.infraLevels}
        infraBuffer={this.props.infraBuffer}
        categories={this.props.availableInfraLevels[0]}
        onChange={this.props.onInfraLevelsChange}
      />
    );
  }

  renderStatsToggle() {
    if (this.props.mode == 'coverage') {
      return (
        <div className="toggles-list">
          <div className="toggle">
            <label>{I18n.t('map.index.infra_levels.statistics')}</label>
            <Toggle
              className='custom-toggle'
              defaultChecked={this.props.showInfraStats}
              icons={false}
              onChange={this.props.onInfraStatsChange}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={`${this.props.className} infra-levels`} style={{height: "100%"}}>
        <Scrollable calcMaxHeight={this.props.calcMaxHeight}>
          <div className="infra-levels__options">
            {this.renderStatsToggle()}

            <div>
              <label>{I18n.t('map.index.infra_levels.buffer.title')}</label>
              <Select
                options={this.props.infraBufferOptions}
                onChange={this.props.onInfraBufferChange}
                value={this.props.infraBuffer}
                clearable={false}
              />
            </div>
          </div>
          <hr/>
          <div className="infra-levels__content">
            {this.renderLevels()}
          </div>
        </Scrollable>
      </div>
    )
  }
}

