import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import { API } from '../../../lib/api';
import { Classifications } from '../../../lib/classifications';
import TransitionsChart from '../../charts/transitions';

export default class TransitionsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  loadTransitions(props) {
    API.transitions({
      territory_id: props.territory.id,
      year: props.years.join(',')
    }).then((transitions) => {
      this.props.onTransitionsLoad(transitions.transitions)
    })
  }

  expandMatrix() {
    this.props.onExpandMatrix(this.props.transitions);
  }

  componentDidMount() {
    this.loadTransitions(this.props);

    $('#transitions-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.warning.transitions.body'))
    });
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.territory, nextProps.territory) ||
       !_.isEqual(this.props.years, nextProps.years)){
      this.loadTransitions(nextProps)
    }
  }

  render() {
    return (
      <div className="map-panel__item-content">
        <h3 className="map-control__header">
          {I18n.t('map.index.transitions.analysis')}

          <i id="transitions-tooltip"
            className="material-icons tooltip">
            &#xE88E;
          </i>
        </h3>

        <div className="map-control__content map-control__content-no-max-height">
          <a onClick={this.expandMatrix.bind(this)} className="sankey__preview"></a>
          <button className="primary" onClick={this.expandMatrix.bind(this)}>
            {I18n.t('map.index.transitions.matrix.title')}
          </button>
        </div>
      </div>
    );
  }
}
