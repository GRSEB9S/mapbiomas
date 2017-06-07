import React, { Component } from 'react';
import classNames from 'classnames';
import Scrollable from '../../lib/scrollable';

const labels = {
  'farming': { id: 1, color: '#06FF00' },
  'water': { id: 2, color: '#1E90FF' },
  'forestry': { id: 3, color: '#A55CD6' },
  'forest': { id: 4, color: '#FF0000' },
  'no_transition': { id: 5, color: '#CECECE' }
}

class TransitionsLabels extends Component {
  isChecked(id) {
    return _.contains(this.props.layers, id);
  }

  handleLayerCheck(id, checked) {
    let ids = _.clone(this.props.layers);

    if(checked) {
      ids.push(id);
    } else {
      ids = _.without(ids, id);
    }

    this.props.onChange(ids);
  }

  renderLayer(layer, index) {
    let labelObj = labels[layer];
    let checked = this.isChecked(labelObj.id);

    return (
      <div key={index} className="transitions-labels__item">
        <i style={{ color: labelObj.color }}
          onClick={(e) => {
            this.handleLayerCheck(labelObj.id, !checked);
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
    return (
      <Scrollable calcMaxHeight={this.props.calcMaxHeight} className="map-panel__action-panel">
        <div className="map-panel__content">
          {
            ['farming', 'water', 'forestry', 'forest', 'no_transition'].map((l, i) => {
              return this.renderLayer(l, i);
            })
          }
        </div>
      </Scrollable>
    );
  }
}

export default TransitionsLabels;
