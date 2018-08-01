import React from 'react';
import _ from 'underscore';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

const territoryName = (myMapsPage, territory, map) => {
  let label;

  if (myMapsPage && map) {
    return (
      <label>{ I18n.t('map.index.chart.map', { map: map.name }) }</label>
    );
  }

  if (!myMapsPage) {
    return (
      <label>{ I18n.t('map.index.chart.territory', { territory: _.first(territory).name }) }</label>
    );
  }

  return null;
};

const CoverageMenu = ({
  availableYears,
  availableClassifications,
  defaultClassifications,
  map,
  myMapsPage,
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
      { territoryName(myMapsPage, territory, map) }
    </div>

    <CoveragePieChart
      availableClassifications={availableClassifications}
      defaultClassifications={defaultClassifications}
      territory={territory}
      year={year}
    />

    <CoverageLineChart
      availableYears={availableYears}
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
