import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader, Panel } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Notifications from '../collections/notifications/collection.js';

class NotificationsList extends Component {

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    const loadMore = this.props.loadMore;
    const totalCount = this.props.totalCount;

    if (results && results.length) {
      return (
        <ListGroup>
          {results.map(notification => {
            return <Components.NotificationsFullscreenItem key={notification._id} notification={notification} />
          })}
          {(results.length < totalCount) ? <ListGroupItem  onClick={() => loadMore()}> Load More </ListGroupItem> : <ListGroupItem>All Notifications loaded</ListGroupItem>}
        </ListGroup>
      )
    } else {
      return <Components.Loading />
    }
  }
}

const options = {
  collection: Notifications,
  queryName: 'notificationsFullScreenQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 30,
};

registerComponent('NotificationsList', NotificationsList, withList(options), withCurrentUser);
