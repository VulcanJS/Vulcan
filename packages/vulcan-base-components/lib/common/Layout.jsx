import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

const Layout = ({currentUser, children, currentRoute}) =>

  <div className={classNames('wrapper', `wrapper-${currentRoute.name.replace('.', '-')}`)} id="wrapper">

    {currentUser ? <Components.UsersProfileCheck currentUser={currentUser} documentId={currentUser._id} /> : null}

    <Components.Header />
  
    <div className="main">

      <Components.FlashMessages />

      <Components.Newsletter />

      {children}

    </div>
  
    <Components.Footer />
  
  </div>

registerComponent('Layout', Layout, withCurrentUser);