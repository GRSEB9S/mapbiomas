import React from 'react';
import { MapModal } from './modal';

const TutorialModal = ({ title, html, onClose }) => (
  <MapModal
    title={title}
    showCloseButton={false}
    showOkButton={true}
    verticalSmaller={true}
    horizontalSmaller={true}
    onClose={onClose}>
    <div dangerouslySetInnerHTML={{__html: html}}></div>
  </MapModal>
);

export default TutorialModal;
