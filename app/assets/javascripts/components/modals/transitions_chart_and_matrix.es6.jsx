import React from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { MapModal } from './modal';
import { Classifications } from '../../lib/classifications';
import { Sankey } from '../../lib/sankey';
import TransitionsChart from '../charts/transitions';
import TransitionsMatrix from '../panels/transitions/matrix';


export default class TransitionsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  get sortedClassifications() {
    return _.sortBy(this.props.classifications, (c) => _.indexOf(this.props.treeIds, c.id));
  }

  render() {
    let sankey = new Sankey(this.props.classifications, this.props.transitions);

    return (
      <MapModal
        title={I18n.t('map.index.transitions.matrix.title')}
        showCloseButton={true}
        showOkButton={false}
        onClose={this.props.onClose}
        overlay={true}
      >
        <div className="transitions-modal">
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
                transitions={this.props.transitions}
                classifications={this.sortedClassifications}
                toTotalData={this.props.toTotalData}
                fromTotalData={this.props.fromTotalData}
              />
            </TabPanel>
          </Tabs>
        </div>
      </MapModal>
    );
  }
}
