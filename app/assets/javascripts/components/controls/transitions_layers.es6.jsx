import React, { Component } from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import Scrollable from '../../lib/scrollable';

const labels = {
  'water_reduction': { id: 0, color: '#FFA500' },
  'forest': { id: 1, color: '#FF0000' },
  'no_transition': { id: 2, color: '#818181' },
  'farming': { id: 3, color: '#06FF00' },
  'water': { id: 4, color: '#4169E1' },
  'forestry': { id: 5, color: '#8A2BE2' }
}

class TransitionsLayers extends Component {
  isChecked(id) {
    return _.contains(this.props.options, id);
  }

  handleLayerCheck(id, checked) {
    let ids = _.clone(this.props.options);

    if(checked) {
      ids.push(id);
    } else {
      ids = _.without(ids, id);
    }

    this.props.onChange(ids);
  }

  handleAllLayersChange(e) {
    let ids = e.target.checked ? this.props.availableOptions : [];

    this.props.onChange(ids);
  }

  renderLayer(layer, index) {
    let labelObj = labels[layer];
    let checked = this.isChecked(labelObj.id);

    return (
      <div key={index} className="transitions-labels__item">
        <i style={{ color: labelObj.color }}
          onClick={(e) => {
            if (!this.props.iframe) {
              this.handleLayerCheck(labelObj.id, !checked);
            }
          }}
          className={classNames(
            'transitions-labels__icon',
            'fa', {
              'fa-circle': checked,
              'fa-circle-o': !checked
            }
          )}
        />

        <label>
          {I18n.t(`map.index.transitions.labels.${layer}`)}
        </label>
      </div>
    )
  }

  render() {
    let allLayersSelected = this.props.options.length == this.props.availableOptions.length;

    return (
      <Scrollable calcMaxHeight={this.props.calcMaxHeight} className="map-panel__action-panel">
        <div className="map-panel__content map-panel-can-hide">
          {this.props.iframe && (
            <h3>{I18n.t('map.index.transitions.labels.title')}</h3>
          )}

          {!this.props.iframe && (
            <label className="transitions-labels__select">
              <input
                type="checkbox"
                checked={allLayersSelected}
                onChange={this.handleAllLayersChange.bind(this)}
              />

              {I18n.t('map.index.transitions.select_all')}
            </label>
          )}

          <div className="transitions-labels__items">
            {['farming', 'water', 'water_reduction', 'forestry', 'forest', 'no_transition'].map((l, i) => {
              return this.renderLayer(l, i);
            })}
          </div>
        </div>
      </Scrollable>
    );
  }
}

export default TransitionsLayers;
