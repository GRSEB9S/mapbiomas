import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import { API } from '../../../lib/api';
import { Classifications } from '../../../lib/classifications';
import { TransitionsChart } from './transitions_chart';

export default class TransitionsControl extends React.Component {
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

  renderTransitions() {
    let classifications = new Classifications(this.props.classifications);
    let transitions = this.props.transitions;
    let nodes = transitions.reduce((memo, transition) => {
      let from = classifications.findById(transition.from);
      let to = classifications.findById(transition.to);

      if(_.isUndefined(from) || _.isUndefined(to)) return memo;
      return memo.concat([
        {
          name: from.name,
          id: from.id,
          type: 'from',
          color: from.color
        },
        {
          name: to.name,
          id: to.id,
          color: to.color,
          type: 'to'
        }
      ]);
    }, []);

    nodes = _.uniq(nodes, (n) => `${n.type}->${n.name}`);

    let links = transitions.map((transition) => {
      let fromIndex = _.findIndex(nodes, (n) => {
        return n.id == transition.from && n.type == 'from';
      });
      let toIndex = _.findIndex(nodes, (n) => {
        return n.id == transition.to && n.type == 'to';
      });

      if(fromIndex === -1 || toIndex === -1) return;

      return {
        source: fromIndex,
        target: toIndex,
        value: parseFloat(transition.area)
      };
    }).filter((t) => !_.isUndefined(t) && parseFloat(t.value) != 0);

    return (
      <ul className="transitions-sankey">
        <li className="transitions-sankey__label"><label>{this.props.years.join('-')}</label></li>
        <li>
          <TransitionsChart
            transition={this.props.transition}
            setTransition={this.props.setTransition}
            nodes={nodes}
            links={links} />
        </li>
      </ul>
    );
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
