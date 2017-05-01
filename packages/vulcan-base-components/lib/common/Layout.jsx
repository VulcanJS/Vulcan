import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';

const Layout = props =>
  <div className="wrapper" id="wrapper">

    <Components.HeadTags />

    <Components.UsersProfileCheck currentUser={props.currentUser} documentId={props.currentUser && props.currentUser._id} />

    <Components.Header />
  
    <div className="main">

      <Components.FlashMessages />

      <Components.Newsletter />

      {props.children}

    </div>
  
    <Components.Footer />
  
  </div>

registerComponent('Layout', Layout, withCurrentUser);