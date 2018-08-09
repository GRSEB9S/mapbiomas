import React from 'react';

const QualityLabels = ({ mode }) => (
  <div className="map-panel__action-panel">
    <div className="map-panel__content">
      <h3 className="map-panel__header">
        {I18n.t('map.index.quality.labels.title')}
      </h3>

      <label className="quality-labels__subtitle">
        {I18n.t('map.index.quality.labels.subtitle')}
      </label>
    </div>
  </div>
);

export default QualityLabels;
