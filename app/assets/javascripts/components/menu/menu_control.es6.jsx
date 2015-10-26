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

        <a className="menu__item" href="/">{I18n.t('views.layouts.header.home')}</a>
        <a className="menu__item" href="/">{I18n.t('views.layouts.header.methodology')}</a>
        <a className="menu__item" href="/">{I18n.t('views.layouts.header.contact')}</a>
      </nav>
    )
  }
}
