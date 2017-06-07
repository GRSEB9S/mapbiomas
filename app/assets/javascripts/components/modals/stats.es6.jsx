import React from 'react';
import { MapModal } from './modal';
import Stats from '../stats/stats';

const StatsModal = ({
  classifications,
  onClose,
  selectedClassifications,
  selectedTerritories,
  years
}) => {
  return (
    <MapModal
      title={I18n.t('stats.title')}
      showCloseButton={true}
      showOkButton={false}
      onClose={onClose}
      verticalSmaller={true}
      overlay={true}
    >
      <div className="stats-modal">
        <Stats
          classifications={classifications}
          selectedClassifications={selectedClassifications}
          selectedTerritories={selectedTerritories}
          years={years}
        />
      </div>
    </MapModal>
  );
}

export default StatsModal;
