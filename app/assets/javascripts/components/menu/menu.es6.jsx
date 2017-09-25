import React from 'react';
import { MenuButton } from './menu_button';
import { MenuControl } from './menu_control';

export default class Menu extends React.Component {
  componentWillMount() {
    this.setState({menuOpen: false})
  }

  toggleMenu() {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  render() {
    return (
      <div>
        <MenuButton
          menu_fn={this.toggleMenu.bind(this)}
          menu_on={this.state.menuOpen}
        />
        <MenuControl
          {...this.props}
          menu_fn={this.toggleMenu.bind(this)}
          menu_on={this.state.menuOpen}
        />
      </div>
    )
  }
}
