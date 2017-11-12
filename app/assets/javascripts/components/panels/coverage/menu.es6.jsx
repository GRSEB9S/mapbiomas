import React from 'react';
import _ from 'underscore';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

const territoryName = (territory, map) => {
  if (!_.isArray(territory)) {
    return I18n.t('map.index.chart.territory', { territory: territory.name });
  }

  if (territory.length == 1) {
    return I18n.t('map.index.chart.territory', { territory: territory[0].name });
  }

  return I18n.t('map.index.chart.map', { map: map.name });
};

const CoverageMenu = ({
  availableClassifications,
  defaultClassifications,
  map,
  onExpandModal,
  territory,
  year
}) => (
  <div>
    <h3 className="map-control__header">
      {I18n.t('map.index.coverage.analysis')}
    </h3>
    <div>
      <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
      <label>{I18n.t('map.index.chart.year', {year: year})}</label>
      <label>{ territoryName(territory, map) }</label>
    </div>

    <CoveragePieChart
      availableClassifications={availableClassifications}
      defaultClassifications={defaultClassifications}
      territory={territory}
      year={year}
    />

    <CoverageLineChart
      availableClassifications={availableClassifications}
      defaultClassifications={defaultClassifications}
      territory={territory}
      year={year}
    />

    <button className="primary" onClick={onExpandModal.bind(this)}>
      {I18n.t('map.index.coverage.details')}
    </button>
  </div>
);

export default CoverageMenu;
