/*
The original Header component is defined using React's
functional stateless component syntax, so we redefine
it the same way.
*/

import { IndexLink } from 'react-router';
import Users from 'meteor/nova:users';
import React from 'react';
import { withCurrentUser, getSetting, Components, replaceComponent } from 'meteor/nova:core';

const NotificationsHeader = (props, context) => {

  const logoUrl = getSetting("logoUrl");
  const siteTitle = getSetting("title", "Nova");
  const tagline = getSetting("tagline");

  return (
    <div className="header-wrapper">

      <header className="header">

        <div className="logo">
          <Components.Logo logoUrl={logoUrl} siteTitle={siteTitle} />
          {tagline ? <h2 className="tagline">{tagline}</h2> : "" }
        </div>

        <div className="nav">
          {/* CUSTOM CODE STARTS HERE*/}
          <div className="nav-notifications">
            <Components.NotificationsMenu/>
          </div>
          {/* CUSTOM CODE ENDS HERE*/}
          <div className="nav-user">
            {!!props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
          </div>

          <div className="nav-new-post">
            <Components.PostsNewButton/>
          </div>

        </div>

      </header>
    </div>
  )
}

replaceComponent('Header', NotificationsHeader);
