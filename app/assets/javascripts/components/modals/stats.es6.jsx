import React from 'react';
import { MapModal } from './modal';
import Stats from '../stats/stats';

const StatsModal = ({
  classifications,
  myMapsPage,
  onClose,
  selectedMap,
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
          myMapsPage={myMapsPage}
          classifications={classifications}
          selectedMap={selectedMap}
          selectedClassifications={selectedClassifications}
          selectedTerritories={selectedTerritories}
          years={years}
        />
      </div>
    </MapModal>
  );
}

export default StatsModal;
