import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import withNewEditor from '../editor/withNewEditor.jsx';

// In here we define the Layout component for the page and also instantiate a new
// Ory-Editor instance by applying the `withNewEditor` HoC. 

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

replaceComponent('Layout', Layout, withNewEditor);
