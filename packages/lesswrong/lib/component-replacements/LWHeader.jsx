/*
The original Header component is defined using React's
functional stateless component syntax, so we redefine
it the same way.
*/

import { IndexLink } from 'react-router';
import Users from 'meteor/vulcan:users';
import React, { PropTypes, Component } from 'react';
import {Utils, withCurrentUser, getSetting, Components, replaceComponent } from 'meteor/vulcan:core';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

//TODO: Add `withNewEditor` somewhere that is more reasonable. id:11
import withNewEditor from '../editor/withNewEditor.jsx';

class LWHeader extends Component {

  render () {

    logoUrl = getSetting("logoUrl");
    siteTitle = getSetting("title", "vulcan");
    tagline = getSetting("tagline");

    notificationTerms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0")};
    messageTerms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0"), notificationType: 'newMessage'};


    return (
      <header className="header-wrapper">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <Components.Logo logoUrl={Utils.getSiteUrl() + 'packages/lesswrong/assets/Logo.svg'}/>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight={true}>
            {!!this.props.currentUser ? <Components.NotificationsMenu title="Notifications" terms={notificationTerms}/> : null}
            {!!this.props.currentUser ? <Components.UsersMenu/> : <Components.UsersAccountMenu/>}
            <LinkContainer to="/newPost">
              <NavItem> <Components.PostsNewButton /> </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar>
      </header>
    )
  }
}

replaceComponent('Header', LWHeader, withCurrentUser);
