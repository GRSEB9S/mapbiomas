import React from 'react';
import classNames from 'classnames';

export class MapModal extends React.Component {
  renderCloseButton() {
    if(this.props.showCloseButton) {
      return (
        <i className="material-icons map-modal__close"
          onClick={this.props.onClose}>
          &#xE5CD;
        </i>
      );
    }
  }

  renderTutorialButton() {
    if(this.props.showTutorialButton) {
      return (
        <button className="map-modal__tutorial--button primary" onClick={this.props.onTutorialClick}>
          {I18n.t('map.modal.tutorial')}
        </button>
      );
    }
  }

  renderOkButton() {
    if(this.props.showOkButton) {
      return (
        <button className="map-modal__ok primary" onClick={this.props.onClose}>
          {I18n.t('map.modal.ok')}
        </button>
      );
    }
  }

  render() {
    var classes = classNames("map-modal", {
      "map-modal--vertical-smaller": this.props.verticalSmaller,
      "map-modal--horizontal-smaller": this.props.horizontalSmaller
    });

    if(this.props.overlay) {
      var overlay = <div className="map-modal__overlay"></div>;
    }

    return (
      <div className="map-modal__wrapper">
        {overlay}
        <div className={classes}>
          <h2 className="map-modal__header">
            {this.props.title}
          </h2>

          {this.renderCloseButton()}

          <div className="map-modal__content">
            { this.props.children }
          </div>

          <div className="map-modal__buttons">
            {this.renderTutorialButton()}
            {this.renderOkButton()}
          </div>
        </div>
      </div>
    );
  }
}
