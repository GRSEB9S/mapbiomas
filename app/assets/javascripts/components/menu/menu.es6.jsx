class Menu extends React.Component {
  componentWillMount() {
    this.setState({menu_open: false})
  }

  toggleMenu() {
    this.setState({menu_open: !this.state.menu_open})
  }

  render() {
    return (
      <div>
        <MenuButton menu_fn={this.toggleMenu.bind(this)} menu_on={this.state.menu_open}/>
        <MenuControl menu_fn={this.toggleMenu.bind(this)} menu_on={this.state.menu_open}/>
      </div>
    )
  }
}
