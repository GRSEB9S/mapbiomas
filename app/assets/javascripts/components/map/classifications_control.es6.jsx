class ClassificationsControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classificationIds: null
    }
  }

  get classifications() {
    return this.props.classifications;
  }

  get classificationIds() {
    return this.state.classificationIds || this.props.defaultClassifications;
  }

  isChecked(id) {
    return this.classificationIds.indexOf(id) != -1;
  }

  handleCheck(id, e) {
    if(e.target.checked && !this.isChecked(id)) {
      let classificationIds = this.classificationIds;
      classificationIds.push(id);
      this.setState({ classificationIds: classificationIds }, () => {
        this.props.onChange(classificationIds);
      })
    } else if(!e.target.checked && this.isChecked(id)) {
      let classificationIds = _.without(this.classificationIds, id);
      this.setState({ classificationIds: classificationIds }, () => {
        this.props.onChange(classificationIds);
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
