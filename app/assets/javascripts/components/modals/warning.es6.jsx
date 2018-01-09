import React from 'react';
import { MapModal } from './modal';

const WarningModal = ({ title, html, onClose, showTutorialButton, onTutorialClick }) => (
  <MapModal
    title={title}
    showCloseButton={false}
    showOkButton={true}
    showTutorialButton={showTutorialButton}
    onTutorialClick={onTutorialClick}
    verticalSmaller={true}
    horizontalSmaller={true}
    overlay={true}
    onClose={onClose}>
    <div dangerouslySetInnerHTML={{__html: html}}></div>
  </MapModal>
);

export default WarningModal;
