import React from 'react';
import qualityLabels from '../../../../images/quality_labels.png';

const QualityLabels = ({ mode }) => (
  <div className="map-panel__action-panel">
    <div className="map-panel__content">
      <h3 className="map-panel__header">
        {I18n.t('map.index.quality.labels.title')}
      </h3>

      <label className="quality-labels__subtitle">
        {I18n.t('map.index.quality.labels.subtitle')}
      </label>

      <img src={qualityLabels}/>

      <div className="quality-labels__labels">
        <label>0</label>
        <label>23</label>
      </div>
    </div>
  </div>
);

export default QualityLabels;
