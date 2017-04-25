import React from 'react';
import { QualityLabels } from '../../control/quality/quality_labels';

const QualityAuxiliarControls = ({ mode }) => {
  if(mode == 'quality') {
    return(
      <div className="map-control-wrapper
          map-control-wrapper--smaller
          map-control-wrapper--left
          map-control-wrapper--bottom">
        <QualityLabels />
      </div>
    );
  }

  return null;
};

export default QualityAuxiliarControls;