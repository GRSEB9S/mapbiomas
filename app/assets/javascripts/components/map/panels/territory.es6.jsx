import React from 'react';
import cx from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';

const renderTabPanel = (
  category,
  territory,
  loadTerritories,
  onTerritoryChange
) => {
  let value, label;

  if(territory && territory.category.toLowerCase() === category.toLowerCase()) {
    value = territory.value;
    label = territory.label;
  }

  return (
    <TabPanel>
      <div className="map-panel__content">
        <Select.Async
          name="territory-select"
          value={value}
          loadOptions={loadTerritories(category, (category === 'país' || category === 'bioma'))}
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
  className,
  territory,
  loadTerritories,
  onTerritoryChange
}) => (
  <Tabs className={cx(className, 'map-panel__tab-panel')}>
    <TabList className="four-tabbed">
      <Tab>{I18n.t('map.index.layers.countries')}</Tab>
      <Tab>{I18n.t('map.index.layers.states')}</Tab>
      <Tab>{I18n.t('map.index.layers.cities')}</Tab>
      <Tab>{I18n.t('map.index.layers.biomes')}</Tab>
    </TabList>
    {renderTabPanel('país', territory, loadTerritories, onTerritoryChange)}
    {renderTabPanel('estado', territory, loadTerritories, onTerritoryChange)}
    {renderTabPanel('municipio', territory, loadTerritories, onTerritoryChange)}
    {renderTabPanel('bioma', territory, loadTerritories, onTerritoryChange)}
  </Tabs>
);

export default Territory;