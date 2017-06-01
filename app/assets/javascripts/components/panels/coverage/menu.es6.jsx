import React from 'react';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

const CoverageMenu = ({
  availableClassifications,
  defaultClassifications,
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
  </div>
);

export default CoverageMenu;
