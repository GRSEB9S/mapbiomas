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

        {this.renderItem('bad')}
        {this.renderItem('regular')}
        {this.renderItem('good')}
      </div>
    );
  }
}
