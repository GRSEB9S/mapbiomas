import React from 'react';
import classNames from 'classnames';
import { Locale } from '../../lib/locale';

export class MenuControl extends React.Component {
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
            <a className="menu__link" href='#'>
              {I18n.t('layouts.header.about.title')}
            </a>
            <ul className="submenu__items">
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("about/about")}>
                  {I18n.t('layouts.header.about.about_mapbiomas')}
                </a>
              </li>

              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("about/products")}>
                  {I18n.t('layouts.header.about.products')}
                </a>
              </li>
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("about/about-us")}>
                  {I18n.t('layouts.header.about.about_us')}
                </a>
              </li>
            </ul>
          </li>

          <li className="menu__item">
            <a className="menu__link" href='#'>
              {I18n.t('layouts.header.map_data.title')}
            </a>
            <ul className="submenu__items">
              <li className="menu__item">
                <a className="menu__link" href='#'>
                  {I18n.t('layouts.header.map_data.coverage_of_land_use')}
                  </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href='#'>
                  {I18n.t('layouts.header.map_data.land_use_change')}
                  </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href='#'>
                  {I18n.t('layouts.header.map_data.statistics')}
                  </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href='#'>
                  {I18n.t('layouts.header.map_data.quality_and_accuracy')}
                  </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href='#'>
                  {I18n.t('layouts.header.map_data.downloads.title')}
                  </a>
                  <ul className="submenu__items">
                    <li className="menu__item">
                      <a className="menu__link" href='#'>
                        {I18n.t('layouts.header.map_data.downloads.disclaimer')}
                        </a>
                    </li>
                    <li className="menu__item">
                      <a className="menu__link" href='#'>
                        {I18n.t('layouts.header.map_data.downloads.maps_collections')}
                        </a>
                    </li>
                    <li className="menu__item">
                      <a className="menu__link" href='#'>
                        {I18n.t('layouts.header.map_data.downloads.reference')}
                        </a>
                    </li>
                    <li className="menu__item">
                      <a className="menu__link" href='#'>
                        {I18n.t('layouts.header.map_data.downloads.mosaics')}
                        </a>
                    </li>
                  </ul>
              </li>
            </ul>
          </li>

          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('methodology')}>
              {I18n.t('layouts.header.methodology')}
            </a>
          </li>

          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('contact')}>
              {I18n.t('layouts.header.contact.title')}
            </a>
          </li>
        </ul>
      </nav>
    )
  }
}
