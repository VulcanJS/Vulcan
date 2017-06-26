import { Components, registerComponent, withCurrentUser, withList, withEdit } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Notifications from '../collections/notifications/collection.js'

class NotificationsMenu extends Component {

  render() {
      const results = this.props.results;
      const currentUser = this.props.currentUser;
      const refetch = this.props.refetch;
      const loading = this.props.loading;
      const loadMore = this.props.loadMore;
      const totalCount = this.props.totalCount;
      const title = this.props.title;

      let unreadNotifications = [];
      if (results && results.length) {
        unreadNotifications = results.filter(this.isNotViewed);
      }
      // console.log(currentUser);
      // console.log(refetch);

      //TODO: Display Load More button only when not all notifications are loaded already
      if (!currentUser) {
        return null;
      } else if (results && results.length) {
        return (
          <NavDropdown className="notification-nav" id="notification-nav" onClick={this.viewNotifications(unreadNotifications)} title={title+' ('+unreadNotifications.length+')'}>
            <LinkContainer to={{pathname: '/inbox', query: {select: "Notifications"}}}>
              <MenuItem> See all your notifications and messages </MenuItem>
            </LinkContainer>
            <MenuItem divider />
            {results.map(notification => <Components.NotificationsItem key={notification._id} currentUser={currentUser} notification={notification} />)}
            <MenuItem divider />
            <MenuItem onClick={() => loadMore()}>Load More</MenuItem>
          </NavDropdown>
        )
      } else if (loading) {
          return (<Components.Loading/>)
      } else {
          return (
          <NavDropdown className="notification-nav" id="notification-nav" onClick={this.viewNotifications(unreadNotifications)} title={title+' ('+unreadNotifications.length+')'}>
              <div> No results </div>
          </NavDropdown>)
      }
  }

  isNotViewed(notification) {
    return (!notification.viewed);
  };

  viewNotifications(results) {
    const VIEW_NOTIFICATIONS_DELAY = 500;
    return () => {
      return setTimeout(() => {
        if(results && results.length){
          let editMutation = this.props.editMutation;
          let set = {viewed: true};
          results.forEach((notification) => {
            // console.log(notification);
            editMutation({documentId: notification._id, set: set, unset: {}});
          });
        }
      }, VIEW_NOTIFICATIONS_DELAY)
    }
  };

};

const withListOptions = {
  collection: Notifications,
  queryName: 'notificationsListQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 5,
};

const withEditOptions = {
  collection: Notifications,
  fragmentName: 'notificationsNavFragment',
};


registerComponent('NotificationsMenu', NotificationsMenu, withList(withListOptions), withEdit(withEditOptions), withCurrentUser);
