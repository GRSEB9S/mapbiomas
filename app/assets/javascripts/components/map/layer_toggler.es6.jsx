const LayerToggler = (props) => {
  const classes = classNames("map-control", "layer-toggler");
  return (
    <div className={classes}>
      <button className="layer-toggler__button" onClick={props.toggle}>
      </button>
    </div>
  );
}
