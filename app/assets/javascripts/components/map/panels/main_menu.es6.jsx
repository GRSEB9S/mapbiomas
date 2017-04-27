import React from 'react';
import cx from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const TAB_INDEX_MAP = {
  coverage: 0,
  transitions: 1,
  quality: 2
};

const INDEX_TAB_MAP = {
  0: 'coverage',
  1: 'transitions',
  2: 'quality'
};

const MainMenu = ({
  mode,
  onModeChange,
  coveragePanel,
  transitionsPanel,
  qualityPanel
}) => (
  <div className="map-panel__item">
    <Tabs
      selectedIndex={TAB_INDEX_MAP[mode]}
      onSelect={(index) => onModeChange(INDEX_TAB_MAP[index])}
    >
      <TabList className="three-tabbed">
        <Tab>{I18n.t('map.index.coverage.title')}</Tab>
        <Tab>{I18n.t('map.index.transitions.title')}</Tab>
        <Tab>{I18n.t('map.index.quality.title')}</Tab>
      </TabList>
      <TabPanel>{coveragePanel}</TabPanel>
      <TabPanel>{transitionsPanel}</TabPanel>
      <TabPanel>{qualityPanel}</TabPanel>
    </Tabs>
  </div>
);

export default MainMenu;