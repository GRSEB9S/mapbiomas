class MenuControl extends React.Component {
  setLocale(locale) {
    Locale.setLocale({locale: locale}).done(function() {
      window.location.reload();
    }).error(function(){
      alert(I18n.t("map.index.locales.warning"));
    });
  }

  render() {
    return (
      <nav className={classNames("menu", { "menu--expanded": this.props.menu_on })}>
        <div className="menu__header">
          {I18n.t('layouts.header.menu')}
          <button className="trigger" onClick={this.props.menu_fn}>
            <span className="fa fa-close"></span>
          </button>
        </div>

        <ul className="menu__items">
          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('about')}>
              {I18n.t('layouts.header.about')}
            </a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('methodology')}>
              {I18n.t('layouts.header.methodology')}
            </a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('land_use')}>
              {I18n.t('layouts.header.land_use')}
              </a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href="/">
              {I18n.t('layouts.header.database.title')}
            </a>
            <ul className="submenu__items">
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("database/reference_maps")}>
                  {I18n.t('layouts.header.database.reference')}
                </a>
              </li>
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("database/landsat_mosaics")}>
                  {I18n.t('layouts.header.database.mosaics')}
                  </a>
              </li>
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("database/mapbiomas_collection")}>
                  {I18n.t('layouts.header.database.collection')}
                </a>
              </li>
            </ul>
          </li>
          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path("workspace")}>
              {I18n.t('layouts.header.workspace')}
            </a>
          </li>
          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('contact')}>
              {I18n.t('layouts.header.contact.title')}
            </a>
          </li>
          <li className="menu__item translation main-nav__menu__item main-nav__translation">
            <i className="fa fa-language translation__icon"></i>
            <a className="menu__link translation__link"
              href="#"
              onClick={this.setLocale.bind(this, "pt-BR")}>
              PT-BR
            </a>
            <a className="menu__link translation__link"
              href="#"
              onClick={this.setLocale.bind(this, "en")}>
              EN
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
