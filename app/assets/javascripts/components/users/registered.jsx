import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

export default class RegisteredUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ordering: {
        order: 'asc',
        attribute: 'id'
      }
    };
  }

  onOrderingClick(attribute) {
    let order;

    if (this.state.ordering.attribute == attribute) {
      order = this.state.ordering.order == 'asc' ? 'desc' : 'asc';
    } else {
      order = 'asc'
    }

    this.setState({
      ordering: { attribute, order }
    })
  }

  renderHeader() {
    const attributes = ['id', 'name', 'email', 'created_at', 'institution', 'occupation'];
    const attributesRows = attributes.map((a, i) => {
      let icon;
      if (this.state.ordering.attribute == a) {
        icon = this.state.ordering.order == 'asc' ? 'down' : 'up'
      } else {
        icon = 'down'
      }

      let iconClassnames = classNames(
        'material-icons',
        'registered-users__ordering',
        { 'registered-users__ordering--active': this.state.ordering.attribute == a }
      )

      return (
        <th
          onClick={this.onOrderingClick.bind(this, a)}
          key={i}
        >
          <div>
            <span className="registered-users__column-name">{I18n.t(`activerecord.attributes.user.${a}`)}</span>
            <i className={iconClassnames}>
              {`arrow_drop_${icon}`}
            </i>
          </div>
        </th>
      )
    });

    return (
      <tr>{attributesRows}</tr>
    );
  }

  renderData() {
    let { attribute, order } = this.state.ordering
    return _.orderBy(this.props.users, attribute, order).map((u, i) => {
      return (
        <tr key={u.id}>
          <td>
            {u.id}
          </td>
          <td>{u.name}</td>
          <td>{u.email}</td>
          <td>{I18n.l('time.formats.short', u.created_at)}</td>
          <td>{u.institution}</td>
          <td>{u.occupation}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="page page__container registered-users">
        <h1>{I18n.t('users.registered.title')}</h1>
        <h1>{I18n.t('users.registered.subtitle', {total: this.props.users.length})}</h1>

        <table>
          <tbody>
            {this.renderHeader()}
            {this.renderData()}
          </tbody>
        </table>
      </div>
    );
  }
}
