import React from 'react';
import _ from 'underscore';
import Select from 'react-select-plus';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { API } from '../../lib/api';
import { Territories } from '../../lib/territories';

export class MyMaps extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.initialState = {
      name: '',
      selectedIndex: 0
    };
  }

  get mapsOptions() {
    return this.props.maps.map((m) => {
      return {
        label: m.name,
        value: m.id
      };
    });
  }

  handleNameChange(e) {
    _.debounce(this.setState({name: e.target.value}), 250);
  }

  handleTabChange(selectedIndex) {
    this.setState({ selectedIndex });
  }

  loadTerritories() {
    return (input, callback) => {
      clearTimeout(this.timeoutId);

      if (input) {
        this.timeoutId = setTimeout(() => {
          API.territories({
            name: input.toUpperCase()
          })
          .then((territories) => {
            callback(null, {
              options: new Territories(territories).withCategory()
            });
          });
        }, 500);
      } else {
        callback(null, { options: [] });
      }
    };
  }

  saveMap() {
    this.setState(this.initialState, this.props.onMapSave(this.state.name));
  }

  renderMapSelect() {
    if (!_.isEmpty(this.props.maps)) {
      return (
        <Select
          options={this.mapsOptions}
          onChange={this.props.onMapSelect}
          value={this.props.selectedMap && this.props.selectedMap.id}
          clearable={false}
        />
      );
    } else {
      return (
        <label>{I18n.t('my_maps.no_maps')}</label>
      );
    }
  }

  render() {
    return (
      <div className="map-panel__action-panel">
        <Tabs
          selectedIndex={this.state.selectedIndex}
          onSelect={this.handleTabChange.bind(this)}
        >
          <TabList className="two-tabbed">
            <Tab>{I18n.t('my_maps.tabs.my_maps')}</Tab>
            <Tab>{I18n.t('my_maps.tabs.new_map')}</Tab>
          </TabList>
          <TabPanel>
            <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
              <h3>{I18n.t('my_maps.title')}</h3>

              { this.renderMapSelect() }
            </div>
          </TabPanel>
          <TabPanel>
            <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
              <h3>{I18n.t('my_maps.new_map.title')}</h3>

              <label className="my-maps__description">{I18n.t('my_maps.new_map.subtitle')}</label>

              <form className="my-maps__form">
                <div className="my-maps__form--input">
                  <label>{I18n.t('my_maps.new_map.name')}</label>
                  <input
                    type="text"
                    value={this.state.name}
                    onChange={this.handleNameChange.bind(this)}
                  />

                  <label>Territórios</label>
                  <Select.Async
                    name="territory-select"
                    value={this.props.territories}
                    loadOptions={this.loadTerritories()}
                    onChange={this.props.onTerritorySelect}
                    clearable={false}
                    ignoreAccents={false}
                    noResultsText={false}
                    searchingText={I18n.t('stats.index.searching')}
                    multi={true}
                  />
                </div>
              </form>

              <div className="my-maps__actions">
                <button onClick={this.saveMap.bind(this)}>{I18n.t('my_maps.new_map.submit')}</button>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
