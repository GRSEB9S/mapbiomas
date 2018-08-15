import React from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import { MapModal } from './modal';
import { Classifications } from '../../lib/classifications';
import { Sankey } from '../../lib/sankey';
import TransitionsChart from '../charts/transitions';
import TransitionsMatrix from '../panels/transitions/matrix';

const CLASSIFICATION_LEVELS = [
  { label: I18n.t('map.index.transitions.level_select.level_1'), value: 'level1' },
  { label: I18n.t('map.index.transitions.level_select.level_2'), value: 'level2' },
  { label: I18n.t('map.index.transitions.level_select.level_3'), value: 'level3' },
];

export default class TransitionsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedLevel: _.first(CLASSIFICATION_LEVELS).value
    };
  }

  get groupedClassifications() {
    return {
      'level1': _.groupBy(this.props.transitions, (t) => [t.from_l1, t.to_l1]),
      'level2': _.groupBy(this.props.transitions, (t) => [t.from_l2, t.to_l2]),
      'level3': _.groupBy(this.props.transitions, (t) => [t.from_l3, t.to_l3])
    };
  }

  get fromTotalData() {
    return {
      'level1': _.groupBy(this.props.fromTotalData, (t) => [t.from_l1, t.to]),
      'level2': _.groupBy(this.props.fromTotalData, (t) => [t.from_l2, t.to]),
      'level3': _.groupBy(this.props.fromTotalData, (t) => [t.from_l3, t.to])
    }
  }

  get toTotalData() {
    return {
      'level1': _.groupBy(this.props.toTotalData, (t) => [t.from, t.to_l1]),
      'level2': _.groupBy(this.props.toTotalData, (t) => [t.from, t.to_l2]),
      'level3': _.groupBy(this.props.toTotalData, (t) => [t.from, t.to_l3])
    }
  }

  get sortedClassifications() {
    return _.sortBy(this.props.classifications, (c) => _.indexOf(this.props.treeIds, c.id));
  }

  groupDataByLevel(collection) {
    return _.map(collection, (value, key) => {
      let [from, to] = _.split(key, ',');

      return {
        from: parseInt(from),
        to: parseInt(to),
        area: _.reduce(value, (sum, t) => sum + t.area, 0)
      }
    });
  }

  handleClassificationLevelChange(level) {
    this.setState({ selectedLevel: level.value });
  }

  render() {
    let groupedTransitions = this.groupDataByLevel(this.groupedClassifications[this.state.selectedLevel]);
    let sankey = new Sankey(this.props.classifications, groupedTransitions);
    let fromTotalData = this.groupDataByLevel(this.fromTotalData[this.state.selectedLevel]);
    let toTotalData = this.groupDataByLevel(this.toTotalData[this.state.selectedLevel]);

    return (
      <MapModal
        title={I18n.t('map.index.transitions.matrix.title')}
        showCloseButton={true}
        showOkButton={false}
        onClose={this.props.onClose}
        overlay={true}
      >
        <div className="transitions-modal">
          <div className="level-select">
            <label>{I18n.t('map.index.transitions.level_select.title')}</label>
            <Select
              value={this.state.selectedLevel}
              options={CLASSIFICATION_LEVELS}
              onChange={this.handleClassificationLevelChange.bind(this)}
              searchable={false}
              clearable={false}
            />
          </div>
          <Tabs>
            <TabList>
              <Tab>{I18n.t('map.index.transitions.sankey.title')}</Tab>
              <Tab>{I18n.t('map.index.transitions.matrix.title')}</Tab>
            </TabList>
            <TabPanel>
              <div className="transitions-sankey">
                <div className="transitions-sankey__label"><label>{this.props.years.join('-')}</label></div>
                <div>
                  <TransitionsChart
                    iframe={this.props.iframe}
                    transition={this.props.transition}
                    setTransition={this.props.setTransition}
                    nodes={sankey.nodes}
                    links={sankey.links}
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <TransitionsMatrix
                years={this.props.years}
                downloadUrl={this.props.downloadUrl}
                transitions={groupedTransitions}
                classifications={this.sortedClassifications}
                toTotalData={toTotalData}
                fromTotalData={fromTotalData}
              />
            </TabPanel>
          </Tabs>
        </div>
      </MapModal>
    );
  }
}
