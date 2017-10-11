import React from 'react';
import _ from 'underscore';
import Select from 'react-select-plus';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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

              {this.props.selectedMap && (
                <div className="my-maps__embed-code">
                  <h3>{I18n.t('my_maps.embed_code')}</h3>

                  <blockquote>
                    &lt;iframe width="960" height="720" src={window.location.origin + Routes.iframe_path(this.props.selectedMap.id)} frameborder="0"&gt;&lt;/iframe&gt;
                  </blockquote>
                </div>
              )}
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
