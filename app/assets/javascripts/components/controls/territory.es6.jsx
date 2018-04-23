import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select-plus';

const renderTabPanel = (
  category,
  territory,
  loadTerritories,
  onTerritoryChange
) => {
  let value, label;

  if (territory && territory.category.toLowerCase() === category.toLowerCase()) {
    value = territory.value;
    label = territory.label;
  }

  return (
    <TabPanel>
      <div className="map-panel__content">
        <Select.Async
          name="territory-select"
          value={value}
          loadOptions={loadTerritories(category, (category === 'país' || category === 'bioma' || category === 'Bacias RHI'))}
          onChange={onTerritoryChange}
          clearable={false}
          ignoreAccents={false}
          noResultsText={false}
          searchingText={I18n.t('map.index.searching')}
          placeholder={label}
        />
      </div>
    </TabPanel>
  );
};

const Territory = ({
  tabIndex,
  territory,
  loadTerritories,
  onTabChange,
  onTerritoryChange
}) => (
  <div className="territories-control">
    <Tabs className="map-panel__action-panel map-panel__tab-panel map-panel-can-hide"
      selectedIndex={tabIndex}
      onSelect={(index) => onTabChange(index)}
    >
      <TabList>
        <Tab>{I18n.t('map.index.layers.countries')}</Tab>
        <Tab>{I18n.t('map.index.layers.states')}</Tab>
        <Tab>{I18n.t('map.index.layers.cities')}</Tab>
        <Tab>{I18n.t('map.index.layers.biomes')}</Tab>
        <Tab>{I18n.t('map.index.layers.drainage_basins')}</Tab>
      </TabList>
      {renderTabPanel('país', territory, loadTerritories, onTerritoryChange)}
      {renderTabPanel('estado', territory, loadTerritories, onTerritoryChange)}
      {renderTabPanel('municipio', territory, loadTerritories, onTerritoryChange)}
      {renderTabPanel('bioma', territory, loadTerritories, onTerritoryChange)}
      {renderTabPanel('Bacias Nivel 2', territory, loadTerritories, onTerritoryChange)}
    </Tabs>
  </div>
);

export default Territory;
