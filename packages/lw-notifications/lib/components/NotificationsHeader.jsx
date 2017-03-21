/*
The original Header component is defined using React's
functional stateless component syntax, so we redefine
it the same way.
*/

import { IndexLink } from 'react-router';
import Users from 'meteor/nova:users';
import React, { PropTypes, Component } from 'react';
import { withCurrentUser, getSetting, Components, replaceComponent } from 'meteor/nova:core';



class NotificationsHeader extends Component {

  render () {

    logoUrl = getSetting("logoUrl");
    siteTitle = getSetting("title", "Nova");
    tagline = getSetting("tagline");

    terms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0")};


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
              {!!this.props.currentUser ? <Components.NotificationsMenu terms={terms}/> : <div></div>}
            </div>
            {/* CUSTOM CODE ENDS HERE*/}
            <div className="nav-user">
              {!!this.props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
            </div>

            <div className="nav-new-post">
              <Components.PostsNewButton/>
            </div>

          </div>

        </header>
      </div>
    )
  }
}

replaceComponent('Header', NotificationsHeader, withCurrentUser);
