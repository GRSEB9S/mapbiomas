import React from 'react';
import Scrollable from '../../../lib/scrollable';

const QualityLabel = ({ label }) => (
  <div className="transitions-labels__item">
    <div className={`transitions-labels__item--icon ${label}`}></div>

    <label>
      {I18n.t(`map.index.transitions.labels.${label}`)}
    </label>
  </div>
)

const TransitionsLabels = ({ calcMaxHeight }) => (
  <Scrollable calcMaxHeight={calcMaxHeight} className="map-panel__action-panel">
    <div className="map-panel__content">
      <h3 className="map-panel__header">
        {I18n.t('map.index.transitions.labels.title')}
      </h3>

      <QualityLabel label={'farming'} />
      <QualityLabel label={'forest'} />
      <QualityLabel label={'forestry'} />
      <QualityLabel label={'no_transition'} />
      <QualityLabel label={'water'} />
    </div>
  </Scrollable>
);

export default TransitionsLabels;
