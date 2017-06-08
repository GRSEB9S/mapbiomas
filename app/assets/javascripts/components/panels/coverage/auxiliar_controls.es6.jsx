import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassificationControl from '../../controls/classification';
import TogglesControl from '../../controls/toggles';

const CoverageAuxiliarControls = ({
  availableBaseMaps,
  availableClassifications,
  availableLayers,
  baseMaps,
  classifications,
  handleBaseMapsChange,
  handleClassificationsChange,
  handleLayersChange,
  handleViewOptionsIndexSelect,
  layers,
  viewOptionsIndex
}) => (
  <Tabs
      className="map-panel__action-panel map-panel__tab-panel"
      selectedIndex={viewOptionsIndex}
      onSelect={handleViewOptionsIndexSelect}>
    <TabList className="three-tabbed">
      <Tab>{I18n.t('map.index.classifications.title')}</Tab>
      <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
      <Tab>{I18n.t('map.index.layers.title')}</Tab>
    </TabList>
    <TabPanel>
      <ClassificationControl
        className="map-panel__content"
        options={classifications}
        availableOptions={availableClassifications}
        onChange={handleClassificationsChange}
        calcMaxHeight={() => (
          $('#coverage-auxiliar-controls').height() - 55
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
