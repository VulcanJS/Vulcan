import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

const Layout = ({currentUser, children}) => 
  <div className="wrapper" id="wrapper">

    <Components.HeadTags />

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header {...this.props}/>

    <div className="main">

      <Components.FlashMessages />


      <Components.Newsletter />

      {children}

    </div>

    <Components.Footer />

  </div>

Layout.displayName = "Layout";

registerComponent('Layout', Layout);
