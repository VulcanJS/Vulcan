const Layout = props => {

  ({HeadTags, Header, Footer} = Telescope.components);
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