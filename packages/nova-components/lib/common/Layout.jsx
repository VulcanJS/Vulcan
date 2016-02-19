const Layout = props => {

  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");

  return (
    <div className="wrapper" id="wrapper">
      <Header/>
      <div className="main">
        {props.children}
      </div>
      <Footer/>
    </div>
  )
}

module.exports = Layout;