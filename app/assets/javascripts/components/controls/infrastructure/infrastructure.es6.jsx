import React, { Component } from 'react';
import HierarchyCategory from './hierarchy_category';
import Scrollable from '../../../lib/scrollable';
import Select from 'react-select';

export default class InfrastructureControl extends Component {
  get bufferOptions() {
    return [
      { value: 'none', label: I18n.t('map.index.infra_levels.buffer.none') },
      { value: '5k', label: I18n.t('map.index.infra_levels.buffer.5_k') },
      { value: '10k', label: I18n.t('map.index.infra_levels.buffer.10_k') },
      { value: '20k', label: I18n.t('map.index.infra_levels.buffer.20_k') }
    ];
  }

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

  render() {
    return (
      <div className={`${this.props.className} infra-levels`} style={{height: "100%"}}>
        <Scrollable calcMaxHeight={this.props.calcMaxHeight}>
          <div className="infra-levels__options">
            <div>
              <label>{I18n.t('map.index.infra_levels.buffer.title')}</label>
              <Select
                options={this.bufferOptions}
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

