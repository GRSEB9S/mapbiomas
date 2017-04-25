import React from 'react';
import cx from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { OpacityControl } from '../../control/opacity_control';
import { TogglesControl } from '../../control/toggles_control';

const CoverageAuxiliarControls = ({
  mode,
  mapProps,
  opacity,
  handleOpacityChange,
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
      <div className="map-control-wrapper
          map-control-wrapper--smaller
          map-control-wrapper--left
          map-control-wrapper--bottom">
        <OpacityControl
          {...mapProps}
          opacity={opacity * 100}
          onChange={handleOpacityChange} />
        <Tabs
            selectedIndex={viewOptionsIndex}
            onSelect={handleViewOptionsIndexSelect}>
          <TabList className="three-tabbed">
            <Tab>{I18n.t('map.index.classifications.title')}</Tab>
            <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
            <Tab>{I18n.t('map.index.layers.title')}</Tab>
          </TabList>
          <TabPanel>
            <TogglesControl
              options={classifications}
              availableOptions={availableClassifications}
              title={I18n.t('map.index.classifications.title')}
              tooltip={I18n.t('map.index.classifications.tooltip')}
              onChange={handleClassificationsChange}
            />
          </TabPanel>
          <TabPanel>
            <TogglesControl
              options={baseMaps}
              availableOptions={availableBaseMaps}
              title={I18n.t('map.index.base_maps.title')}
              tooltip={I18n.t('map.index.base_maps.tooltip')}
              onChange={handleBaseMapsChange}
            />
          </TabPanel>
          <TabPanel>
            <TogglesControl
              options={layers}
              availableOptions={availableLayers}
              title={I18n.t('map.index.layers.title')}
              onChange={handleLayersChange}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }

  return null;
};

export default CoverageAuxiliarControls;