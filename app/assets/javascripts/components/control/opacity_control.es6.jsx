const OpacityControl = (props) => {
  return (
    <div className="map-control">
      <h3 className="map-control__header">
        {I18n.t('map.index.opacity')}
      </h3>
      <input type="range" style={{width: '100%'}} value={props.opacity}
        onChange={props.onChange}
        min="0" max="100" />
    </div>
  );
}
