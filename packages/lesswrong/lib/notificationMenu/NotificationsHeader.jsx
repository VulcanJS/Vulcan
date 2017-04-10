/*
The original Header component is defined using React's
functional stateless component syntax, so we redefine
it the same way.
*/

import { IndexLink } from 'react-router';
import Users from 'meteor/vulcan:users';
import React, { PropTypes, Component } from 'react';
import { withCurrentUser, getSetting, Components, replaceComponent } from 'meteor/vulcan:core';



class NotificationsHeader extends Component {

  render () {

    logoUrl = getSetting("logoUrl");
    siteTitle = getSetting("title", "vulcan");
    tagline = getSetting("tagline");

    notificationTerms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0")};
    messageTerms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0"), notificationType: 'newMessage'};


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
              {!!this.props.currentUser ? <Components.NotificationsMenu title="Notifications" terms={notificationTerms}/> : <div></div>}
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
