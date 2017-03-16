import { registerFragment } from 'meteor/nova:core';

registerFragment(`
  fragment notificationsNavFragment on Notification {
    _id
    userId
    notificationMessage
    createdAt
    type
    viewed
  }
`);
