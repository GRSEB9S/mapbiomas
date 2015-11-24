class MenuControl extends React.Component {
  render() {
    return (
      <nav className={this.props.menu_on ? "menu state--expanded" : "menu"}>
        <div className="menu__header">
          {I18n.t('layouts.header.menu')}
          <button className="trigger" onClick={this.props.menu_fn}>
            <span className="fa fa-close"></span>
          </button>
        </div>

        <a className="menu__item" href="/">{I18n.t('layouts.header.about')}</a>
        <a className="menu__item" href="/pages/methodology">{I18n.t('layouts.header.methodology')}</a>
        <a className="menu__item" href="/">{I18n.t('layouts.header.land_use')}</a>
        <a className="menu__item" href="/">{I18n.t('layouts.header.database')}</a>
        <a className="menu__item" href="/">{I18n.t('layouts.header.workspace')}</a>
        <a className="menu__item" href="/">{I18n.t('layouts.header.contact')}</a>
      </nav>
    )
  }
}
