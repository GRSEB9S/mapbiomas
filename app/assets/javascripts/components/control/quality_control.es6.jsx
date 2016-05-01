import React from 'react';
import Select from 'react-select';
import { Territories } from '../../lib/territories';

export class QualityControl extends React.Component {
  render() {
    let territories = new Territories(this.props.availableTerritories);

    return (
      <div className="map-control">
        <h3 className="map-control__header">
          {I18n.t('map.index.quality_analysis')}
        </h3>
        <div className="map-control__content">
          <label>{I18n.t('map.index.search')}</label>
          <Select
            name="territory-select"
            value={this.props.territory.id}
            options={territories.toOptions()}
            onChange={this.props.onTerritoryChange}
            clearable={false}
          />
        </div>
      </div>
    );
  }
}
