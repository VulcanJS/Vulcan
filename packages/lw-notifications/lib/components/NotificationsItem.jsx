import { Components, registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import { Dropdown, DropdownButton, MenuItem } from 'react-bootstrap';



class NotificationsItem extends Component {

  render() {

    currentUser = this.props.currentUser;
    notification = this.props.notification;
    className = "notification-item " + (notification.viewed ? "viewed" : "unviewed");
    return ( <div>
      <MenuItem href="" key={notification._id} disabled={notification.viewed} active>
          {notification.notificationMessage ? notification.notificationMessage : "No Message"}
          &nbsp;
          ({notification.type ? notification.type : "Unknown Type"})
      </MenuItem>
      <DropdownButton bsSize="xsmall" role="menuitem" bsStyle='link' title='Debug Information'>
            <MenuItem> userId: {notification.userId} </MenuItem>
            <MenuItem> notificationId: {notification._id} </MenuItem>
            <MenuItem> documentId: {notification.documentId} </MenuItem>
            <MenuItem> viewed: {notification.viewed}</MenuItem>
      </DropdownButton>
      <MenuItem divider /> </div>
    )
  }

}

registerComponent('NotificationsItem', NotificationsItem)
