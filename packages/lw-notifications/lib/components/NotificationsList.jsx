import { Components, registerComponent, withCurrentUser, withList } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/nova:users';
import Notifications from '../collection.js'
import { withApollo } from 'react-apollo';

const something = (props) => <div>Something</div>


class NotificationsList extends Component {

  render() {

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
}

// const options = {
//   collection: Notifications,
//   queryName: 'notificationsListQuery',
//   fragmentName: 'notificationsNavFragment',
//   limit: 1,
// };

const options = {
  collection: Notifications,
  queryName: 'notificationsListQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 5,
};


registerComponent('NotificationsList', NotificationsList,  withList(options), withCurrentUser, withApollo)
