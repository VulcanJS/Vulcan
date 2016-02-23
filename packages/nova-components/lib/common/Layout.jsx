const Layout = props => {

  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");

  return (
    <div className="wrapper" id="wrapper">
      <Header {...props}/>
      <div className="main">
        {props.children}
      </div>
      <Footer {...props}/>
    </div>
  )
}

module.exports = Layout;