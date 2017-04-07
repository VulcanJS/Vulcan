/* 

The Header component.

Components.ModalTrigger is a built-in Vulcan component that displays
its children in a popup triggered by either a text link, or a cusotm
component (if the "component" prop is specified).

*/

import React, { PropTypes, Component } from 'react';
import { Components, withCurrentUser } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import PicsNewForm from '../pics/PicsNewForm';

// navigation bar component when the user is logged in

const NavLoggedIn = ({currentUser}) =>

  <div className="header-nav header-logged-in">
    
      <div className="header-accounts">

        Welcome,&nbsp;
        
        <Components.ModalTrigger label={Users.getDisplayName(currentUser)} size="small">
          <div>
            {Users.isAdmin(currentUser) ? <p>Admin</p> : null}
            <Components.AccountsLoginForm />
          </div>
        </Components.ModalTrigger>

      </div>

      <Components.ModalTrigger label="Upload">
        <PicsNewForm />
      </Components.ModalTrigger>

  </div>

// navigation bar component when the user is logged out

const NavLoggedOut = ({currentUser}) =>

  <div className="header-nav header-logged-out">
    
      <Components.ModalTrigger label="Sign Up/Log In" size="small">
        <Components.AccountsLoginForm />
      </Components.ModalTrigger>

  </div>

// Header component

const Header = ({currentUser}) =>

  <div className="header-wrapper">

    <div className="header">
      
      <h1 className="logo">
        <img src="/packages/example-instagram/lib/static/vulcanstagram.png" alt="Vulcanstagram"/>
      </h1>

      {currentUser ? 
        <NavLoggedIn currentUser={currentUser}/> : 
        <NavLoggedOut currentUser={currentUser}/>
      }

    </div>

  </div>

export default withCurrentUser(Header);