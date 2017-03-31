import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader, Panel } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Notifications from "meteor/lw-notifications";

class NotificationsList extends Component {

  render() {

    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;

    return (
      <ListGroup>
        {results.map(notification => {
          return <Components.NotificationsFullscreenItem key={notification._id} notification={notification} />
        })}
      </ListGroup>
    )
  }
}

const options = {
  collection: Notifications,
  queryName: 'notificationsFullScreenQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 50,
};

registerComponent('NotificationsList', NotificationsList, withList(options), withCurrentUser);
