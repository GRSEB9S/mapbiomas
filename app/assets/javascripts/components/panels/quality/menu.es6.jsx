import React from 'react';
import QualityChart from '../../charts/quality';

const QualityMenu = ({
  cards,
  classifications,
  qualities,
  qualityDataUrl,
  qualityInfo,
  territory,
  year
}) => (
  <QualityChart
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
