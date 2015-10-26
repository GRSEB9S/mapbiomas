class MenuControl extends React.Component {
  render() {
    return (
      <nav id="main-menu" className="menu">
        <div className="menu__header">
          Menu
          <button className="trigger" data-target=".menu" data-attr="state--expanded">
            <span className="fa fa-close"></span>
          </button>
        </div>

        <a className="menu__item" href="/">Início</a>
        <a className="menu__item" href="/">Metodologia</a>
        <a className="menu__item" href="/">Contato</a>
      </nav>
    )
  }
}
