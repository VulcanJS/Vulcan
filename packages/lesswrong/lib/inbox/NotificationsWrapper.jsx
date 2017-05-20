/*

The Navigation for the Inbox components

*/

import React, { PropTypes, Component } from 'react';
import { Button, Grid, Row, Col, ListGroup, ListGroupItem, PageHeader, Panel, DropdownButton, MenuItem } from 'react-bootstrap';
import { Components, registerComponent, ModalTrigger, withList, withCurrentUser } from 'meteor/vulcan:core';
import Notifications from "../collections/notifications/collection.js";

class NotificationsWrapper extends Component {



  constructor(props) {
    super(props);
    this.state = {notificationsFilter: ""};
  }

  render() {

    const views = ["newPost", "newPendingPost", "postApproved", "newComment", "newReply", "newUser"];

    const terms = {view: 'userNotifications', userId: (!!this.props.currentUser ? this.props.currentUser._id : "0"), notificationType: this.state.notificationsFilter};

    return (

      <div className="notification-filters">
        <DropdownButton
          bsStyle="default"
          className="views btn-secondary"
          id="views-dropdown"
          title="Notification Filters"
        >
          <MenuItem onClick={() => this.setState({notificationsFilter: ""})}>All Notifications</MenuItem>
          {views.map(view =>
            <MenuItem key={view} onClick={() => this.setState({notificationsFilter: view})}>{view}</MenuItem>
          )}
        </DropdownButton>
        <Components.NotificationsList terms={terms} />
      </div>

    )
  }
}

registerComponent('NotificationsWrapper', NotificationsWrapper, withCurrentUser);
