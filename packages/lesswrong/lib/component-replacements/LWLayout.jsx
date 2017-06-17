import { Components, replaceComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import withNewEditor from '../editor/withNewEditor.jsx';
import Intercom, { IntercomAPI } from 'react-intercom';


// In here we define the Layout component for the page and also instantiate a new
// Ory-Editor instance by applying the `withNewEditor` HoC. We also instantiate
// the intercom component

const Layout = ({currentUser, children}) =>
  <div className="wrapper" id="wrapper">

    <Components.HeadTags />

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header {...this.props}/>

    <div className="main">

      <Components.FlashMessages />

      {currentUser ? <Intercom appID="wtb8z7sj"
          user_id={currentUser._id} email={currentUser.email} name={currentUser.displayName}
      /> : null}

      {currentUser ? IntercomAPI('update', { "name" : currentUser.displayName, "email" : currentUser.email, "user_id" : currentUser._id, "createdAt" : currentUser.createdAt }) : null}
      {children}

    </div>

    {/* TODO: Commented out footer for now, we might want to add our own Footer at a later point id:221*/}
    {/* <Components.Footer /> */}

  </div>

Layout.displayName = "Layout";

replaceComponent('Layout', Layout, withNewEditor, withCurrentUser);
