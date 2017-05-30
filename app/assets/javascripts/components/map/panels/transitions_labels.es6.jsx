import React from 'react';

const QualityLabel = ({ label }) => (
  <div className="transitions-labels__item">
    <div className={`transitions-labels__item--icon ${label}`}></div>

    <label>
      {I18n.t(`map.index.transitions.labels.${label}`)}
    </label>
  </div>
)

const QualityLabels = ({ mode }) => (
  <div className="map-panel__action-panel">
    <div className="map-panel__content">
      <h3 className="map-panel__header">
        {I18n.t('map.index.transitions.labels.title')}
      </h3>

      <QualityLabel label={'farming'} />
      <QualityLabel label={'forest'} />
      <QualityLabel label={'no_transition'} />
      <QualityLabel label={'water'} />
    </div>
  </div>
);

export default QualityLabels;
