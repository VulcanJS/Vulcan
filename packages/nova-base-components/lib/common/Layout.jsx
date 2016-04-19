import React from 'react';

import Core from "meteor/nova:core";
const FlashContainer = Core.FlashContainer;

const Layout = props => {

  ({Header, Footer, FlashMessages, Newsletter, HeadTags, UsersProfileCheck} = Telescope.components);

  return (
    <div className="wrapper" id="wrapper">

      <HeadTags />

      <UsersProfileCheck {...props} />

      <Header {...props}/>
    
      <div className="main">

        <FlashContainer component={FlashMessages}/>

        <Newsletter />

        {props.children}

      </div>
    
      <Footer {...props}/>
    
    </div>
  )
}

module.exports = Layout;