import Users from "meteor/nova:users";
import Posts from "meteor/nova:posts";
import Comments from "meteor/nova:comments";

/**
 * @summary Notification schema
 * @type {SimpleSchema}
 */
const notificationSchema = new SimpleSchema({
  itemId: {
    type: String
  },
  notificationMessage: {
    type: String
  },
  notificationDate: {
    type: Date
  },
  viewed: {
    type: Boolean,
    defaultValue: false
  }
});

Users.addField([
  /**
    An array containing notifications for new comments
  */
  {
    fieldName: 'commentNotifications',
    fieldSchema: {
      type: [notificationSchema],
      optional: true,
      viewableBy: Users.own,
    }
  },
  /**
    An array containing notifications for new replies to the user's comments
  */
  {
    fieldName: 'replyNotifications',
    fieldSchema: {
      type: [notificationSchema],
      optional: true,
      viewableBy: Users.own,
    }
  },
  /**
    An array containing notificiations for new posts
  */
  {
    fieldName: 'postNotifications',
    fieldSchema: {
      type: [notificationSchema],
      optional: true,
      viewableBy: Users.own,
    }
  }
]);
