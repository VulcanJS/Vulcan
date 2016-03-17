const Layout = props => {

  ({Header, Footer} = Telescope.components);

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