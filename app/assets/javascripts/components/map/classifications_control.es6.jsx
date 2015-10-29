class ClassificationsControl extends React.Component {
  get ids() {
    this.props.classifications.map((c) => c.id);
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let ids = this.ids;
      ids.push(id);
      this.props.onChange(ids);
    } else if(!e.target.checked && this.isChecked(id)) {
      let ids = _.without(this.ids, id);
      this.props.onChange(ids);
    }
  }

  render() {
    let classificationsNodes = this.classifications.map((classification)=>{
      return (
        <li key={classification.id} className="classification-item">
          <label>{classification.name}</label>
          <Toggle
            defaultChecked={this.isChecked(classification.id)}
            onChange={this.handleCheck.bind(this, classification.id)} />
        </li>
      );
    });

    return (
      <div className="map-control classifications-control">
        <h3 className="map-control__header">
          Classificações
        </h3>

        <div className="map-control__content">
          <ul className="classifications-list">
            {classificationsNodes}
          </ul>
        </div>
      </div>
    );
  }
}
