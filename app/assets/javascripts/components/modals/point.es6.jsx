import React from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { MapModal } from './modal';
import { MapCanvas } from '../map/map_canvas';
import Stats from '../stats/stats';
import TransitionsChart from '../charts/transitions';
import { API } from '../../lib/api';
import { Sankey } from '../../lib/sankey';
import { Territories } from '../../lib/territories';

export default class PointModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      territory: null,
      transitions: []
    };
  }

  get categories() {
    return this.props.point.categories;
  }

  get emptyCategories() {
    return _.isEmpty(this.props.point.categories);
  }

  setTerritory(territory) {
    Promise.all([
      API.territories({
        name: territory.name,
        category: territory.categoria
      }),
      API.transitions({
        territory_id: territory.id,
        year: this.props.years.join(',')
      })
    ]).then((values) => {
      let newTerritory = _.find(values[0], ['id', territory.id])

      newTerritory = new Territories([newTerritory]).withOptions();

      this.setState({
        territory: newTerritory,
        transitions: values[1]
      });
    });
  }

  territory(category) {
    let territory = this.categories[category];

    if (territory) {
      return (
        <strong>
          <a
            href="#"
            onClick={this.setTerritory.bind(this, territory)}
          >
            { territory.name }
          </a>
        </strong>
      );
    } else {
      return I18n.t('map.index.point_info.category.not_found');
    }
  }

  renderMap() {
    if (this.state.territory) {
      return (
        <MapCanvas
          dataLayerOptions={this.props.dataLayerOptions}
          apiUrl={this.props.apiUrl}
          ref="point-canvas"
          baseMaps={this.props.availableBaseMaps}
          mode='coverage'
          year={this.props.year}
          territory={this.state.territory}
        />
      );
    } else {
      return (
        <div className="point-modal__instructions">
          <h2>{ I18n.t('map.index.point_info.instructions') }</h2>
        </div>
      );
    }
  }

  renderStats() {
    if (this.state.territory) {
      return (
        <Stats
          classifications={this.props.defaultClassifications}
          selectedClassifications={this.props.selectedClassifications}
          selectedTerritories={this.state.territory}
          years={this.props.availableYears}
        />
      );
    } else {
      return (
        <div className="point-modal__instructions">
          <h2>{ I18n.t('map.index.point_info.instructions') }</h2>
        </div>
      );
    }
  }

  renderSankey() {
    if (this.state.territory) {
      let sankey = new Sankey(this.props.classifications, this.state.transitions);

      return (
        <div className="transitions-sankey">
          <div className="transitions-sankey__label"><label>{this.props.years.join('-')}</label></div>
          <TransitionsChart
            transition={this.props.transition}
            setTransition={this.props.setTransition}
            nodes={sankey.nodes}
            links={sankey.links}
          />
        </div>
      );
    } else {
      return (
        <div className="point-modal__instructions">
          <h2>{ I18n.t('map.index.point_info.instructions') }</h2>
        </div>
      );
    }
  }

  renderData() {
    return (
      <Tabs>
        <TabList>
          <Tab>{ I18n.t('map.index.point_info.map') }</Tab>
          <Tab>{ I18n.t('map.index.point_info.coverage') }</Tab>
          <Tab>{ I18n.t('map.index.point_info.transitions') }</Tab>
        </TabList>
        <TabPanel>
          { this.renderMap() }
        </TabPanel>
        <TabPanel>
          { this.renderStats() }
        </TabPanel>
        <TabPanel>
          { this.renderSankey() }
        </TabPanel>
      </Tabs>
    );
  }

  renderModalContent() {
    if(this.emptyCategories) {
      return (
        <div className="point-modal__instructions">
          <label>{ I18n.t('map.index.point_info.no_info') }</label>
        </div>
      );
    }

    return (
      <div className="point-modal">
        <div className="point-modal__categories">
          <div className="point-modal__coordinates">
            <h2>{ `${I18n.t('geolocation.latitude')}: ${this.props.point.latitude}` }</h2>
            <h2>{ `${I18n.t('geolocation.longitude')}: ${this.props.point.longitude}` }</h2>
          </div>

          <h2>{I18n.t('map.index.category.countries.one')}: {this.territory('country')}</h2>
          <h2>{I18n.t('map.index.category.states.one')}: {this.territory('state')}</h2>
          <h2>{I18n.t('map.index.category.cities.one')}: {this.territory('city')}</h2>
          <h2>{I18n.t('map.index.category.biomes.one')}: {this.territory('biome')}</h2>
          <h2>{I18n.t('map.index.category.macro_watersheds.one')}: {this.territory('watershedLevel1')}</h2>
          <h2>{I18n.t('map.index.category.watersheds.one')}: {this.territory('watershedLevel2')}</h2>
          <h2>{I18n.t('map.index.category.indigenous_lands.one')}: {this.territory('indigenousLand')}</h2>
          <h2>{I18n.t('map.index.category.conservation_units.one')}: {this.territory('conservationUnit')}</h2>
        </div>

        <div className="point-modal__data">
          { this.renderData() }
        </div>
      </div>
    );
  }

  render() {
    if (_.isEmpty(this.props.point)) {
      return null;
    }

    return (
      <MapModal
        title={I18n.t('map.index.point_info.title')}
        showCloseButton={true}
        showOkButton={false}
        onClose={this.props.onClose}
        overlay={true}
        verticalSmaller={this.emptyCategories}
        horizontalSmaller={this.emptyCategories}
      >
        { this.renderModalContent() }
      </MapModal>
    );
  }
}
