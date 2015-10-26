class MenuButton extends React.Component {
  render() {
    return (
      <div className="header__menu-trigger">
        <button className="trigger" data-target="#main-menu" data-attr="state--expanded">
          <span className="fa fa-navicon"></span>
        </button>
      </div>
    )
  }
}
