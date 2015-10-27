class MenuButton extends React.Component {
  render() {
    return (
      <div className="header__menu-trigger">
        <button className="trigger" onClick={this.props.menu_fn}>
          <span className="fa fa-navicon"></span>
        </button>
      </div>
    )
  }
}
