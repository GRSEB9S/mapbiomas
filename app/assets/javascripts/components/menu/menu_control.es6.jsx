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

  renderAdminButtons() {
    if(this.props.currentUser.isAdmin) {
      return ([
              <li className="menu__item">
                <a className="menu__link" href={Routes.registered_users_path()}>
                  {I18n.t('users.registered.title')}
                </a>
              </li>,
              <li className="menu__item">
                <a className="menu__link" href={Routes.new_cms_glossary_path()}>
                  {I18n.t('glossaries.title')
                }
                </a>
              </li>
            ]);
    }
  }

  renderSignInButton() {
    if(this.props.currentUser.isSignedIn) {
      return (
        <li className="menu__item login">
          <a className="menu__link menu__link--user" href='#'>
            {this.props.currentUser.name}
          </a>
          <ul className="submenu__items">
            <li className="menu__item">
              <a className="menu__link" href={Routes.my_maps_path()}>
                {I18n.t('my_maps.title')}
              </a>
            </li>

            <li className="menu__item">
              <a className="menu__link" href={Routes.user_profile_path()}>
                {I18n.t('users.profile.title')}
              </a>
            </li>

            {this.renderAdminButtons()}

            <li className="menu__item">
              <a className="menu__link" data-method="delete" href={Routes.destroy_user_session_path()}>
                {I18n.t('devise.sessions.destroy.sign_out')}
              </a>
            </li>
          </ul>
        </li>
      );
    } else {
      return (
        <li className="menu__item login new" data-new={I18n.t('new')}>
          <a className="menu__link" href={Routes.new_user_session_path()}>
            {I18n.t('devise.sessions.new.sign_in')}
          </a>
        </li>
      );
    }
  }

  render() {
    return (
      <nav className={classNames("menu", { "menu--expanded": this.props.menu_on })}>
        <div className="menu__header">
          <h2>{I18n.t('layouts.header.menu')}</h2>

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
                  {I18n.t('layouts.header.about.project')}
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
              <li className="menu__item" >
                <a className="menu__link" href={Routes.page_path("team")}>
                  {I18n.t('layouts.header.about.team.title')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path("terms_of_use")}>
                  {I18n.t('layouts.header.map_data.terms_of_use')}
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
                <a className="menu__link" href={Routes.map_path({anchor: 'coverage'})}>
                  {I18n.t('layouts.header.map_data.land_cover')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.map_path({anchor: 'transitions'})}>
                  {I18n.t('layouts.header.map_data.land_use_change')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.map_path({anchor: 'quality'})}>
                  {I18n.t('layouts.header.map_data.quality_and_accuracy')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.stats_path()}>
                  {I18n.t('layouts.header.map_data.statistics')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path("downloads")}>
                  {I18n.t('layouts.header.map_data.downloads')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path("terms_of_use")}>
                  {I18n.t('layouts.header.map_data.terms_of_use')}
                </a>
              </li>
            </ul>
          </li>

          <li className="menu__item">
            <a className="menu__link" href='#'>
              {I18n.t('layouts.header.methodology.title')}
            </a>
            <ul className="submenu__items">
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('methodology')}>
                  {I18n.t('layouts.header.methodology.atbd')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('workspace')}>
                  {I18n.t('layouts.header.methodology.tools')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('scripts')}>
                  {I18n.t('layouts.header.methodology.scripts')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('accuracy-analysis')}>
                  {I18n.t('layouts.header.methodology.analysis')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path("terms_of_use")}>
                  {I18n.t('layouts.header.map_data.terms_of_use')}
                </a>
              </li>
            </ul>
          </li>

          <li className="menu__item">
            <a className="menu__link" href='#'>
              {I18n.t('layouts.header.communication.title')}
            </a>
            <ul className="submenu__items">
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('announcement_note_collection2_3')}>
                  {I18n.t('layouts.header.communication.news')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('release_collection2')}>
                  {I18n.t('layouts.header.communication.release_collection2')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path('video')}>
                  {I18n.t('layouts.header.communication.project_video')}
                </a>
              </li>
              <li className="menu__item">
                <a className="menu__link" href={Routes.page_path("terms_of_use")}>
                  {I18n.t('layouts.header.map_data.terms_of_use')}
                </a>
              </li>
            </ul>
          </li>

          <li className="menu__item">
            <a className="menu__link" href={Routes.page_path('contact')}>
              {I18n.t('layouts.header.contact.title')}
            </a>
          </li>

          <li className="menu__item">
            <a className="menu__link" target="_blank" href={this.props.forumUrl}>
              {I18n.t('layouts.header.forum.title')}
            </a>
          </li>

          {this.renderSignInButton()}

          {<li className="menu__item translation main-nav__menu__item main-nav__translation">
            <i className="material-icons translation__icon">&#xE8E2;</i>
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
          </li>}
        </ul>
      </nav>
    )
  }
}
