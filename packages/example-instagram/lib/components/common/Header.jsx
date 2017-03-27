import React, { PropTypes, Component } from 'react';
import { Components, withCurrentUser } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import PicsNewForm from '../pics/PicsNewForm';

const HeaderLoggedIn = ({currentUser}) =>

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

      <Components.ModalTrigger label="Upload" size="small">
        <PicsNewForm />
      </Components.ModalTrigger>

  </div>

const HeaderLoggedOut = ({currentUser}) =>

  <div className="header-nav header-logged-out">
    
      <Components.ModalTrigger label="Sign Up/Log In" size="small">
        <Components.AccountsLoginForm />
      </Components.ModalTrigger>

  </div>

const Header = ({currentUser}) =>

  <div className="header-wrapper">

    <div className="header">
      
      <h1 className="logo">
        <img src="/packages/example-instagram/lib/static/vulcanstagram.png" alt="Vulcanstagram"/>
      </h1>

      {currentUser ? 
        <HeaderLoggedIn currentUser={currentUser}/> : 
        <HeaderLoggedOut currentUser={currentUser}/>
      }

    </div>

  </div>

export default withCurrentUser(Header);