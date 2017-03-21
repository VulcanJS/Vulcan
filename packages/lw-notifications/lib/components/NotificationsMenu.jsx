import { Components, registerComponent, withCurrentUser, withList } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/nova:users';
import { withApollo } from 'react-apollo';
import Notifications from '../collection.js'


class NotificationsMenu extends Component {

  renderNotificationsList() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    // console.log(currentUser);
    // console.log(refetch);
    if (results && results.length) {
      return (
        <div>
          {results.map(notification => <Components.NotificationsItem key={notification._id} currentUser={currentUser} notification={notification} />)}
        </div>
      )
    } else if (loading) {
        return (<Components.Loading/>)
    } else {
        return (<MenuItem>No Results</MenuItem>)
    }
  }

  render() {
    const results = this.props.results;
    const {currentUser, client} = this.props;
    var unreadNotifications = 0;
    if (results && results.length) {
      unreadNotifications = results.filter(this.isNotViewed).length;
    }

    if(!currentUser){
      return (<div></div>);
    } else {
      return (
        <div className="notifications-menu">
          <DropdownButton id="notification-menu" bsStyle='info' title={'Notifications (' + unreadNotifications + ')'}>
              {this.renderNotificationsList()}
          </DropdownButton>
        </div>
      )
      }
    }

  isNotViewed(notification) {
    return (!notification.viewed);
  }

}

NotificationsMenu.propsTypes = {
  currentUser: React.PropTypes.object,
  client: React.PropTypes.object,
};

const options = {
  collection: Notifications,
  queryName: 'notificationsListQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 5,
};



registerComponent('NotificationsMenu', NotificationsMenu, withList(options), withCurrentUser, withApollo);
