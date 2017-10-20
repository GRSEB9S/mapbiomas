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

export default class MainMenu extends React.Component {
  renderMainMenu() {
    return (
      <div className="map-panel__action-panel map-panel__tab-panel">
        <Tabs
          selectedIndex={TAB_INDEX_MAP[this.props.mode]}
          onSelect={(index) => this.props.onModeChange(INDEX_TAB_MAP[index])}
        >
          <TabList className={this.props.myMapsPage ? "two-tabbed" : "three-tabbed"}>
            <Tab>{I18n.t('map.index.coverage.title')}</Tab>
            <Tab>{I18n.t('map.index.transitions.title')}</Tab>
            {!this.props.myMapsPage && <Tab>{I18n.t('map.index.quality.title')}</Tab>}
          </TabList>
          <TabPanel>
            <Scrollable calcMaxHeight={this.props.calcMaxHeight} className="map-panel__content">
              {this.props.coveragePanel}
            </Scrollable>
          </TabPanel>
          <TabPanel>
            <Scrollable calcMaxHeight={this.props.calcMaxHeight} className="map-panel__content">
              {this.props.transitionsPanel}
            </Scrollable>
          </TabPanel>
          {!this.props.myMapsPage && (
            <TabPanel>
              <Scrollable calcMaxHeight={this.props.calcMaxHeight} className="map-panel__content">
                {this.props.qualityPanel}
              </Scrollable>
            </TabPanel>
          )}
        </Tabs>
      </div>
    );
  }

  render() {
    if (!this.props.iframe) {
      return this.renderMainMenu();
    }

    if (this.props.iframe && this.props.mode == 'coverage') {
      return (
        <div className="map-panel__content map-panel__action-panel">
          {this.props.coveragePanel}
        </div>
      );
    }

    if (this.props.iframe && this.props.mode == 'transitions') {
      return (
        <div className="map-panel__content map-panel__action-panel">
          {this.props.transitionsPanel}
        </div>
      );
    }
  }
}
