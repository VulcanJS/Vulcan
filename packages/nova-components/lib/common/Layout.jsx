const Layout = props => {

  const Header = Telescope.getComponent("Header");
  const Footer = Telescope.getComponent("Footer");

  return (
    <div>
      <Header/>
      <a href={FlowRouter.path("newPost")}>New Post</a>
      <hr/>
      {props.children}
      <Footer/>
    </div>
  )
}

module.exports = Layout;