import React from 'react';

const Layout = props => {

  ({Header, Footer, FlashContainer, FlashMessages, NewsletterForm} = Telescope.components);

  return (
    <div className="wrapper" id="wrapper">

      <Header {...props}/>
    
      <div className="main">

        <FlashContainer component={FlashMessages}/>

        <NewsletterForm />

        {props.children}

      </div>
    
      <Footer {...props}/>
    
    </div>
  )
}

module.exports = Layout;