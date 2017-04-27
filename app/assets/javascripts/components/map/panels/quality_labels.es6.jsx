import React from 'react';

const QualityLabel = ({ label }) => (
  <div className="quality-labels__item">
    <div className={`quality-labels__item--icon ${label}`}></div>
      <label>
        {I18n.t(`map.index.quality.labels.${label}`)}
      </label>
  </div>
)

const QualityLabels = ({ mode }) => (
  <div className="map-panel__item">
      <div className="map-panel__item-content">
        <h3 className="map-panel__header">
          {I18n.t('map.index.quality.labels.title')}
        </h3>
        <label className="quality-labels__subtitle">
          {I18n.t('map.index.quality.labels.subtitle')}
        </label>
        <QualityLabel label={'good'} />
        <QualityLabel label={'regular'} />
        <QualityLabel label={'bad'} />
      </div>
  </div>
);

export default QualityLabels;