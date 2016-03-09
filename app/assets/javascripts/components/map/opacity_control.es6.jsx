const OpacityControl = (props) => {
  return (
    <div className="map-control">
      <h3 className="map-control__header">
        {I18n.t('map.index.opacity')}
      </h3>
      <input type="number" value={props.opacity}
        onChange={props.onChange}
        min="0" max="100" />
    </div>
  );
}
