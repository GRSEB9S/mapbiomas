import React from 'react';
import _ from 'underscore';
import TransitionsLayersControl from '../../controls/transitions_layers';

export default class TransitionsLabels extends React.Component {
  findClassification(id) {
    return _.find(this.props.classifications, (c) => c.id == id);
  }

  renderTransitionLabel() {
    let from = this.findClassification(this.props.transition.from);
    let to = this.findClassification(this.props.transition.to);

    return (
      <div className="map-panel__content">
        <h3 className="map-control__header">
          {I18n.t('map.index.transitions.selected_transition.title')}
        </h3>

        <div className="transition-label__container">
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.from', {from: from.name})}
          </label>
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.to', {to: to.name})}
          </label>
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.area', {
              area: I18n.toNumber(this.props.transition.area, { precision: 0 })
            })}
          </label>
        </div>

        <button className="primary" onClick={this.props.handleTransitionReset}>
          {I18n.t('map.index.transitions.selected_transition.all_transitions')}
        </button>
      </div>
    );
  }

  renderTransitionsLayersControl() {
    return (
      <TransitionsLayersControl
        iframe={this.props.iframe}
        options={this.props.transitionsLayers}
        availableOptions={this.props.availableTransitionsLayers}
        onChange={this.props.handleTransitionsLayersChange}
        calcMaxHeight={() => (
          $('#transitions-auxiliar-controls').height() - 55
        )}
      />
    );
  }

  render() {
    if (this.props.transition) {
      return this.renderTransitionLabel();
    } else {
      return this.renderTransitionsLayersControl();
    }
  }
}
