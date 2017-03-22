import { Components, registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";
import Users from "meteor/nova:comments";



class NotificationsItem extends Component {


  render() {

    currentUser = this.props.currentUser;
    notification = this.props.notification;
    className = "notification-item " + (notification.viewed ? "viewed" : "unviewed");
    return ( <div>
      <LinkContainer to={notification.link ? notification.link : "/"}>
        <MenuItem key={notification._id} disabled={notification.viewed} active>
            {notification.notificationMessage + ": (" + notification.notificationType + ")"}
        </MenuItem>
      </LinkContainer>
      <DropdownButton id={notification._id} bsSize="xsmall" role="menuitem" bsStyle='link' title='Debug Information'>
            <MenuItem> userId: {notification.userId} </MenuItem>
            <MenuItem> notificationId: {notification._id} </MenuItem>
            <MenuItem> documentId: {notification.documentId} </MenuItem>
            <MenuItem> viewed: {notification.viewed ? "true" : "false"}</MenuItem>
      </DropdownButton>
      <MenuItem divider /> </div>
    )
  }

}

registerComponent('NotificationsItem', NotificationsItem)
