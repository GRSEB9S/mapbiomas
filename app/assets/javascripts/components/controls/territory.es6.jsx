import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select-plus';

export default class TerritoryControl extends Component {
  get preloadedCategories() {
    return _.map(this.props.territoryCategories, 'value');
  }

  render() {
    let value, label;
    let preload = _.includes(this.preloadedCategories, this.props.territoryCategory);

    if (this.props.territory && this.props.territory.category.toLowerCase() === this.props.territoryCategory.toLowerCase()) {
      value = this.props.territory.value;
      label = this.props.territory.label;
    }

    return (
      <div className="territories-control">
        <div className="map-panel__action-panel map-panel__content">
          <div className="category-select">
            <label>{I18n.t('map.index.category.title')}</label>
            <Select
              name="territory-select"
              value={this.props.territoryCategory}
              options={this.props.territoryCategories}
              onChange={this.props.onTabChange}
              searchable={false}
              clearable={false}
              ignoreAccents={false}
              noResultsText={false}
              searchingText={I18n.t('map.index.searching')}
              placeholder={label}
            />
          </div>

          <label>{I18n.t('map.index.territory.title')}</label>
          <Select.Async
            key={this.props.territoryCategory}
            name="territory-select"
            value={value}
            loadOptions={this.props.loadTerritories(this.props.territoryCategory, preload)}
            onChange={this.props.onTerritoryChange}
            clearable={false}
            ignoreAccents={false}
            noResultsText={false}
            searchingText={I18n.t('map.index.searching')}
          />
        </div>
      </div>
    );
  }
}
