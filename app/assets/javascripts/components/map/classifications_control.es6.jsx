class ClassificationsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedIds: []
    }
  }

  get classifications() {
    return this.props.classifications;
  }

  get checkedIds() {
    return this.state.checkedIds || this.props.defaultChecked;
  }

  isChecked(id) {
    return this.checkedIds.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let checkedIds = this.checkedIds;
      checkedIds.push(id);
      this.setState({ checkedIds: checkedIds }, () => {
        this.props.onChange(checkedIds);
      })
    } else if(!e.target.checked && this.isChecked(id)) {
      let checkedIds = _.without(this.checkedIds, id);
      this.setState({ checkedIds: checkedIds }, () => {
        this.props.onChange(checkedIds);
      })
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
      <div className="map-control">
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
