import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { Component } from 'react';
import { Panel, ListGroupItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';



class NotificationsFullscreenItem extends Component {


  render() {
    currentUser = this.props.currentUser;
    notification = this.props.notification;
    // className = "notification-FS-item " + (notification.viewed ? "viewed" : "unviewed");
    return (
      <LinkContainer to={notification.link ? notification.link : "/"}>
        <ListGroupItem>
            {notification.notificationMessage + ": (" + notification.notificationType + ")"}
        </ListGroupItem>
      </LinkContainer>
    )
  }

}

registerComponent('NotificationsFullscreenItem', NotificationsFullscreenItem);
