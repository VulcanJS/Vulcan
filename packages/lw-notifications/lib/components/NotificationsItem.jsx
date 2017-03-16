import { Components, registerComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';



class NotificationsItem extends Component {

  render() {

    currentUser = this.props.currentUser;
    notification = this.props.notification;
    return (
      <div key={notification._id} className="notification-item">
        <p>
          userId: {notification.userId}
          notificationId: {notification._id}
          notificationMessage: {notification.notificationMessage}
          viewed: {notification.viewed}
        </p>
      </div>
    )
  }

}

registerComponent('NotificationsItem', NotificationsItem)
