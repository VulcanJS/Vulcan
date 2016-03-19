const Layout = props => {

<<<<<<< HEAD
  const HeadTags = Telescope.getComponent("HeadTags");
  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");
=======
  ({Header, Footer} = Telescope.components);
>>>>>>> TelescopeJS/nova

  return (
    <div className="wrapper" id="wrapper">
      <HeadTags/>
      <Header {...props}/>
      <div className="main">
        {props.children}
      </div>
      <Footer {...props}/>
    </div>
  )
}

module.exports = Layout;