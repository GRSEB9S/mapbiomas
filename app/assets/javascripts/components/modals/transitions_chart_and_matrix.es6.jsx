import React from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { MapModal } from './modal';
import { Classifications } from '../../lib/classifications';
import TransitionsChart from '../charts/transitions';
import TransitionsMatrix from '../panels/transitions/matrix';

const TransitionsModal = ({
  iframe,
  onClose,
  years,
  downloadUrl,
  transition,
  transitions,
  setTransition,
  classifications,
  toTotalData,
  fromTotalData
}) => {
  let newClassifications = new Classifications(classifications);
  let treeIds = newClassifications.getTreeIds();
  let nodes = transitions.reduce((memo, transition) => {
    let from = newClassifications.findById(transition.from);
    let to = newClassifications.findById(transition.to);

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

  nodes = _.uniqBy(nodes, (n) => [n.type, n.name].join());
  nodes = _.sortBy(nodes, (n) => _.indexOf(treeIds, n.id));

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
  let sortedClassifications = _.sortBy(classifications, (c) => _.indexOf(treeIds, c.id));

  return (
    <MapModal
      title={I18n.t('map.index.transitions.matrix.title')}
      showCloseButton={true}
      showOkButton={false}
      onClose={onClose}
      overlay={true}
    >
      <Tabs>
        <TabList>
          <Tab>{I18n.t('map.index.transitions.sankey.title')}</Tab>
          <Tab>{I18n.t('map.index.transitions.matrix.title')}</Tab>
        </TabList>
        <TabPanel>
          <ul className="transitions-sankey">
            <li className="transitions-sankey__label"><label>{years.join('-')}</label></li>
            <li>
              <TransitionsChart
                iframe={iframe}
                transition={transition}
                setTransition={setTransition}
                nodes={nodes}
                links={links}
              />
            </li>
          </ul>
        </TabPanel>
        <TabPanel>
          <TransitionsMatrix
            years={years}
            downloadUrl={downloadUrl}
            transitions={transitions}
            classifications={sortedClassifications}
            toTotalData={toTotalData}
            fromTotalData={fromTotalData}
          />
        </TabPanel>
      </Tabs>
    </MapModal>
  );
}

export default TransitionsModal;
