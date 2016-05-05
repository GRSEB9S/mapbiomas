import React from 'react';

export class QualityLabels extends React.Component {
  renderItem(key) {
    return (
      <div className="quality-labels__item">
        <div className={`quality-labels__item--icon ${key}`}></div>
          <label>
            {I18n.t(`map.index.quality_labels.${key}`)}
          </label>
      </div>
    );
  }

  render() {
    return (
      <div className="map-control quality-labels">
        <h3 className="map-control__header">
          {I18n.t('map.index.quality_labels.title')}
        </h3>
        <label className="quality-labels__subtitle">{I18n.t('map.index.quality_labels.subtitle')}</label>

        {this.renderItem('good')}
        {this.renderItem('regular')}
        {this.renderItem('bad')}
      </div>
    );
  }
}
