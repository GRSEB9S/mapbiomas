import React from 'react';
import { MapModal } from '../../map/map_modal';

const TransitionsMatrixModal = ({ title, html, onClose }) => (
  <MapModal
    title={title}
    showCloseButton={false}
    showOkButton={true}
    verticalSmaller={true}
    horizontalSmaller={true}
    overlay={true}
    onClose={onClose}>
    <div dangerouslySetInnerHTML={{__html: html}}></div>
  </MapModal>
);

export default TransitionsMatrixModal;