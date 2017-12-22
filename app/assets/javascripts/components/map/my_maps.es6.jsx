import React from 'react';
import _ from 'underscore';
import Select from 'react-select-plus';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { API } from '../../lib/api';
import { Territories } from '../../lib/territories';

export class MyMaps extends React.Component {
  componentDidMount() {
    $('#my-maps-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      interactive: true,
      contentAsHTML: true,
      content: $(I18n.t('my_maps.tooltip'))
    });
  }

  constructor(props) {
    super(props);

    this.state = this.initialState = {
      name: '',
      selectedIndex: 0,
      editMap: false
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

  editMap() {
    this.setState({
      editMap: true,
      name: this.props.selectedMap.name
    });
  }

  cancelMapEdit() {
    this.setState({
      editMap: this.initialState.editMap,
      name: this.initialState.name
    });
  }

  handleMapSave() {
    this.setState(this.initialState, this.props.onMapSave(this.state.name));
  }

  handleMapEdit() {
    this.setState(this.initialState, this.props.onMapEdit(this.state.name));
  }

  handleMapSelect(map) {
    if (this.state.editMap) {
      this.setState({ editMap: this.initialState.editMap },
        this.props.onMapSelect(map)
      );
    } else {
      this.props.onMapSelect(map);
    }
  }

  renderMapSelect() {
    if (!_.isEmpty(this.props.maps)) {
      return (
        <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
          <h3>{I18n.t('my_maps.title')}</h3>

          <Select
            options={this.mapsOptions}
            onChange={this.handleMapSelect.bind(this)}
            value={this.props.selectedMap && this.props.selectedMap.id}
            clearable={false}
          />

          { this.props.selectedMap && !this.state.editMap && (
            <div className="my-maps__actions">
              <button onClick={this.editMap.bind(this)}>{I18n.t('my_maps.edit.title')}</button>
            </div>
          )}

          { this.props.selectedMap && this.state.editMap && (
            <div className="my-maps__edit">
              { this.renderMapForm() }
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
          <h3>
            {I18n.t('my_maps.title')}
            <i id="my-maps-tooltip" className="material-icons tooltip">&#xE88E;</i>
          </h3>
          
          <label>{I18n.t('my_maps.no_maps')}</label>
        </div>
      );
    }
  }

  renderMapForm() {
    let title, subtitle;

    if (this.state.editMap && this.state.selectedIndex == 0) {
      title = I18n.t('my_maps.edit.title');
      subtitle = I18n.t('my_maps.edit.subtitle');
    } else {
      title = I18n.t('my_maps.new.title');
      subtitle = I18n.t('my_maps.new.subtitle');
    }

    return (
      <div>
        <h3>{ title }</h3>

        <label className="my-maps__description">{ subtitle }</label>

        <form className="my-maps__form">
          <div className="my-maps__form">
            <label>{I18n.t('my_maps.new.name')}</label>
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange.bind(this)}
            />

            <label>{I18n.t('stats.territories.title')}</label>

            <div className="my-maps__select">
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
          </div>
        </form>

        <div className="my-maps__actions">
          { !this.state.editMap && this.state.selectedIndex == 1 && (
            <button onClick={this.handleMapSave.bind(this)}>{I18n.t('my_maps.new.submit')}</button>
          )}

          { this.state.editMap && this.state.selectedIndex == 0 && (
            <button onClick={this.handleMapEdit.bind(this)}>{I18n.t('my_maps.edit.submit')}</button>
          )}

          { this.state.editMap && this.state.selectedIndex == 0 && (
            <button className="button--cancel" onClick={this.cancelMapEdit.bind(this)}>{I18n.t('my_maps.edit.cancel')}</button>
          )}
        </div>
      </div>
    );
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
            { this.renderMapSelect() }
          </TabPanel>
          <TabPanel>
            <div className="map-panel__content map-panel__action-panel map-panel-can-hide">
              { this.renderMapForm() }
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
