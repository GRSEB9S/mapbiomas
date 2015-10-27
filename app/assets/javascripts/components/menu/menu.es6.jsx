class Menu extends React.Component {
  componentWillMount() {
    this.setState({menuOpen: false})
  }

  toggleMenu() {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  render() {
    return (
      <div>
        <MenuButton menu_fn={this.toggleMenu.bind(this)} menu_on={this.state.menuOpen}/>
        <MenuControl menu_fn={this.toggleMenu.bind(this)} menu_on={this.state.menuOpen}/>
      </div>
    )
  }
}
