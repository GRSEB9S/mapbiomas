import React from 'react';
import QualityPieChart from '../../charts/quality/pie';

const QualityMenu = ({
  cards,
  classifications,
  qualities,
  qualityDataUrl,
  qualityInfo,
  territory,
  year
}) => (
  <QualityPieChart
    cards={cards}
    territory={territory}
    year={year}
    classifications={classifications}
    qualities={qualities}
    qualityInfo={qualityInfo}
    qualityDataUrl={qualityDataUrl}
  />
);

export default QualityMenu;
