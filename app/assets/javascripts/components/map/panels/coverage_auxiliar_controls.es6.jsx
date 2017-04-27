import React from 'react';
import cx from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { OpacityControl } from '../../control/opacity_control';
import { TogglesControl } from '../../control/toggles_control';

const CoverageAuxiliarControls = ({
  mode,
  mapProps,
  opacity,
  viewOptionsIndex,
  handleViewOptionsIndexSelect,
  classifications,
  availableClassifications,
  handleClassificationsChange,
  baseMaps,
  availableBaseMaps,
  handleBaseMapsChange,
  layers,
  availableLayers,
  handleLayersChange
}) => {
  if(mode == 'coverage') {    
    return (
      <Tabs
          className="map-panel__item"
          selectedIndex={viewOptionsIndex}
          onSelect={handleViewOptionsIndexSelect}>
        <TabList className="three-tabbed">
          <Tab>{I18n.t('map.index.classifications.title')}</Tab>
          <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
          <Tab>{I18n.t('map.index.layers.title')}</Tab>
        </TabList>
        <TabPanel>
          <TogglesControl
            className="map-panel__item-content"
            options={classifications}
            availableOptions={availableClassifications}
            tooltip={I18n.t('map.index.classifications.tooltip')}
            onChange={handleClassificationsChange}
          />
        </TabPanel>
        <TabPanel>
          <TogglesControl
            className="map-panel__item-content"
            options={baseMaps}
            availableOptions={availableBaseMaps}
            tooltip={I18n.t('map.index.base_maps.tooltip')}
            onChange={handleBaseMapsChange}
          />
        </TabPanel>
        <TabPanel>
          <TogglesControl
            className="map-panel__item-content"
            options={layers}
            availableOptions={availableLayers}
            onChange={handleLayersChange}
          />
        </TabPanel>
      </Tabs>
    );
  }

  return null;
};

export default CoverageAuxiliarControls;