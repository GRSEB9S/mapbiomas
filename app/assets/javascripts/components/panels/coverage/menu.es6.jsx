import React from 'react';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

const CoverageMenu = ({
  availableClassifications,
  defaultClassifications,
  onExpandModal,
  territory,
  year
}) => (
  <div>
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
