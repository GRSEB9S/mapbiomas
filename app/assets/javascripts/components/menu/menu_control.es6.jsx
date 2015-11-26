class MenuControl extends React.Component {
  render() {
    return (
      <ul className={this.props.menu_on ? "menu state--expanded" : "menu"}>
        <div className="menu__header">
          {I18n.t('layouts.header.menu')}
          <button className="trigger" onClick={this.props.menu_fn}>
            <span className="fa fa-close"></span>
          </button>
        </div>

        <li><a className="menu__item" href={Routes.page_path('about')}>{I18n.t('layouts.header.about')}</a></li>
        <li><a className="menu__item" href={Routes.page_path('methodology')}>{I18n.t('layouts.header.methodology')}</a></li>
        <li><a className="menu__item" href={Routes.page_path('land_use')}>{I18n.t('layouts.header.land_use')}</a></li>
        <li>
          <a className="menu__item" href="/">{I18n.t('layouts.header.database.title')}</a>
          <ul>
            <li className="menu__item" >
              <a className="menu__item" href={Routes.page_path("database/reference_maps")}>{I18n.t('layouts.header.database.reference')}</a>
            </li>
            <li className="menu__item" >
              <a className="menu__item" href={Routes.page_path("database/landsat_mosaics")}>{I18n.t('layouts.header.database.mosaics')}</a>
            </li>
            <li className="menu__item" >
              <a className="menu__item" href={Routes.page_path("database/mapbiomas_collection")}>{I18n.t('layouts.header.database.collection')}</a>
            </li>
          </ul>
        </li>
        <li><a className="menu__item" href="/">{I18n.t('layouts.header.workspace')}</a></li>
        <li><a className="menu__item" href={Routes.page_path('contact')}>{I18n.t('layouts.header.contact.title')}</a></li>
      </ul>
    )
  }
}
