import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Posts from "meteor/vulcan:posts";
import Comments from "meteor/vulcan:comments";
import Users from "meteor/vulcan:comments";



class NotificationsItem extends Component {


  render() {

    currentUser = this.props.currentUser;
    notification = this.props.notification;
    className = "notification-item " + (notification.viewed ? "viewed" : "unviewed");
    return ( <div>
      <LinkContainer to={notification.link ? notification.link : "/"}>
        <MenuItem key={notification._id} disabled={notification.viewed}>
            {notification.notificationMessage + ": (" + notification.notificationType + ")"}
        </MenuItem>
      </LinkContainer>
      <MenuItem divider /> </div>
    )
  }

}

registerComponent('NotificationsItem', NotificationsItem)
