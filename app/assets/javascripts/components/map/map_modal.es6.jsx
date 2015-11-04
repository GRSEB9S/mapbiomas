class MapModal extends React.Component {
  render() {
    return (
      <div className="map-modal">
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
    );
  }
}
