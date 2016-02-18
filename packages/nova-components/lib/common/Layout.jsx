const Layout = props => {

  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");

  return (
    <div className="wrapper" id="wrapper">
      <Header/>
      <hr/>
      {props.children}
      <hr/>
      <Footer/>
    </div>
  )
}

module.exports = Layout;