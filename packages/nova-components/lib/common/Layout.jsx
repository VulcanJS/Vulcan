const Layout = props => {

  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");

  return (
    <div>
      <Header/>
      <hr/>
      {props.children}
      <hr/>
      <Footer/>
    </div>
  )
}

module.exports = Layout;