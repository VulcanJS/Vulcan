import React from 'react';

import Core from "meteor/nova:core";
const FlashContainer = Core.FlashContainer;

const Layout = props => {

  ({Header, Footer, FlashMessages, NewsletterForm, HeadTags} = Telescope.components);

  return (
    <div className="wrapper" id="wrapper">

      <HeadTags />

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