const Layout = props => {

  ({Header, Footer, FlashContainer, FlashMessages, NewsletterForm} = Telescope.components);

  return (
    <div className="wrapper" id="wrapper">

      <Header {...props}/>
    
      <FlashContainer component={FlashMessages}/>
    
      <div className="main">

        <NewsletterForm />

        {props.children}

      </div>
    
      <Footer {...props}/>
    
    </div>
  )
}

module.exports = Layout;