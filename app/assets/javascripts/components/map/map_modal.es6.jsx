class MapModal extends React.Component {
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
          <i className="material-icons map-modal__close"
              onClick={this.props.onClose}>
            &#xE5CD;
          </i>
          <div className="map-modal__content">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}
