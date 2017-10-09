import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Scrollable from '../../lib/scrollable';

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
  myMapsPage,
  onModeChange,
  coveragePanel,
  transitionsPanel,
  qualityPanel,
  calcMaxHeight
}) => (
  <div className="map-panel__action-panel map-panel__tab-panel">
    <Tabs
      selectedIndex={TAB_INDEX_MAP[mode]}
      onSelect={(index) => onModeChange(INDEX_TAB_MAP[index])}
    >
      <TabList className={myMapsPage ? "two-tabbed" : "three-tabbed"}>
        <Tab>{I18n.t('map.index.coverage.title')}</Tab>
        <Tab>{I18n.t('map.index.transitions.title')}</Tab>
        {!myMapsPage && <Tab>{I18n.t('map.index.quality.title')}</Tab>}
      </TabList>
      <TabPanel>
        <Scrollable calcMaxHeight={calcMaxHeight} className="map-panel__content">
          {coveragePanel}
        </Scrollable>
      </TabPanel>
      <TabPanel>
        <Scrollable calcMaxHeight={calcMaxHeight} className="map-panel__content">
          {transitionsPanel}
        </Scrollable>
      </TabPanel>
      {!myMapsPage && (
        <TabPanel>
          <Scrollable calcMaxHeight={calcMaxHeight} className="map-panel__content">
            {qualityPanel}
          </Scrollable>
        </TabPanel>
      )}
    </Tabs>
  </div>
);

export default MainMenu;
