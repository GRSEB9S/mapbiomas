import React from 'react';
import { MapModal } from '../../map/map_modal';
import { TransitionsMatrix } from '../../control/transitions/transitions_matrix';

const TransitionsMatrixModal = ({
  onClose,
  years,
  downloadUrl,
  transitions,
  classifications,
  toTotalData,
  fromTotalData
}) => (
  <MapModal
    title={I18n.t('map.index.transitions.matrix.title')}
    showCloseButton={true}
    showOkButton={false}
    onClose={onClose}
    verticalSmaller={true}
    overlay={true}
  >
    <TransitionsMatrix
      years={years}
      downloadUrl={downloadUrl}
      transitions={transitions}
      classifications={classifications}
      toTotalData={toTotalData}
      fromTotalData={fromTotalData}
    />
  </MapModal>
);

export default TransitionsMatrixModal;