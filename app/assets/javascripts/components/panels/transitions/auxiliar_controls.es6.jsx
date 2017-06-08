import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TogglesControl from '../../controls/toggles';
import TransitionsLayersControl from '../../controls/transitions_layers';

const CoverageAuxiliarControls = ({
  availableBaseMaps,
  availableLayers,
  availableTransitionsLayers,
  baseMaps,
  handleBaseMapsChange,
  handleLayersChange,
  handleTransitionsLayersChange,
  handleViewOptionsIndexSelect,
  layers,
  transitionsLayers,
  viewOptionsIndex
}) => (
  <Tabs
      className="map-panel__action-panel map-panel__tab-panel"
      selectedIndex={viewOptionsIndex}
      onSelect={handleViewOptionsIndexSelect}>
    <TabList className="three-tabbed">
      <Tab>{I18n.t('map.index.transitions.labels.title')}</Tab>
      <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
      <Tab>{I18n.t('map.index.layers.title')}</Tab>
    </TabList>
    <TabPanel>
      <TransitionsLayersControl
        options={transitionsLayers}
        availableOptions={availableTransitionsLayers}
        onChange={handleTransitionsLayersChange}
        calcMaxHeight={() => (
          $('#transitions-auxiliar-controls').height() - 55
        )}
      />
    </TabPanel>
    <TabPanel>
      <TogglesControl
        className="map-panel__content"
        options={baseMaps}
        availableOptions={availableBaseMaps}
        onChange={handleBaseMapsChange}
      />
    </TabPanel>
    <TabPanel>
      <TogglesControl
        className="map-panel__content"
        options={layers}
        availableOptions={availableLayers}
        onChange={handleLayersChange}
      />
    </TabPanel>
  </Tabs>
);

export default CoverageAuxiliarControls;
