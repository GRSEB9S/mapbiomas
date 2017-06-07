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
      onExpandModal={onExpandModal}
    />
  </div>
);

export default CoverageMenu;
