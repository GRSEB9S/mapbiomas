import React, { Component } from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import tooltipster from 'tooltipster';
import { Classifications } from '../../lib/classifications';
import Scrollable from '../../lib/scrollable';

class ClassificationControl extends Component {
  get availableOptionsIds(){
    return this.props.availableOptions.map((c) => c.id);
  }

  get ids() {
    return this.props.options.map((c) => c.id);
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleAllClassificationsChange(e) {
    let ids = e.target.checked ? this.availableOptionsIds : [];

    this.props.onChange(ids);
  }

  handleClassificationCheck(id, checked) {
    let ids = this.ids;

    if(checked) {
      ids.push(id);
    } else {
      ids = _.without(this.ids, id);
    }

    this.props.onChange(ids);
  }

  renderNode(node, index, parentSummary) {
    const checked = this.isChecked(node.id);
    const summary = parentSummary ? `${parentSummary}.${index}` : index;
    let childrenIndex = 1;

    return (
      <li key={node.id}>
        <div className="classifications-control__node">
          <i style={{ color: node.color }}
            onClick={(e) => {
              return this.handleClassificationCheck(node.id, !checked);
            }}
            className={classNames(
              'classifications-control__node-icon',
              'fa', {
                'fa-circle': checked,
                'fa-circle-o': !checked
              }
            )}
          />
          <div className="classifications-control__node-label">
            {`${summary} ${node.name}`}
          </div>
        </div>
        {(!_.isEmpty(node.children)) && (
          <ul className="classifications-control__children-tree">
            {_.map(node.children, (node) => this.renderNode(node, childrenIndex++, summary))}
          </ul>
        )}
      </li>
    );
  }

  render() {
    let index = 1;
    let allClassificationsSelected = this.ids.length == this.props.availableOptions.length;

    return (
      <div className={this.props.className}>
        <Scrollable calcMaxHeight={this.props.calcMaxHeight}>
          {!this.props.iframe && (
            <label
              dangerouslySetInnerHTML={{
                __html: I18n.t('map.index.classifications.description')
              }}>
            </label>
          )}

          {!this.props.iframe && (
            <label className="classifications-control__select">
              <input
                type="checkbox"
                checked={allClassificationsSelected}
                onChange={this.handleAllClassificationsChange.bind(this)}
              />

              {I18n.t('map.index.classifications.select_all')}
            </label>
          )}

          {this.props.iframe && (
            <h3>{I18n.t('map.index.classifications.title')}</h3>
          )}

          <ul className="classifications-control__inner">
            {_.map(this.props.defaultClassificationsTree, (node) => this.renderNode(node, index++))}
          </ul>
        </Scrollable>
      </div>
    );
  }
}

export default ClassificationControl;
