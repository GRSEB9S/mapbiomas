import React from 'react';
import { MapModal } from './modal';

const TutorialModal = ({ title, html, onClose }) => (
  <div className="map-modal__tutorial">
    <MapModal
      title={title}
      showCloseButton={false}
      showOkButton={true}
      verticalSmaller={true}
      horizontalSmaller={true}
      onClose={onClose}>
      <div dangerouslySetInnerHTML={{__html: html}}></div>
    </MapModal>
  </div>
);

export default TutorialModal;
