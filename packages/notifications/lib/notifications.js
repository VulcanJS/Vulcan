// Not sure SimpleSchema is the right way to go here but 
// I am leaving it for reference
//
// Notifications = new Meteor.Collection("notifications", {
//   schema: new SimpleSchema({
//     properties: {
//       type: Object
//     },
//     event: {
//       type: String
//     },
//     read: {
//       type: Boolean
//     },
//     createdAt: {
//       type: Date
//     },
//     userId: {
//       type: "???"
//     }
//   })
// });

Notifications = new Meteor.Collection('notifications', {
  transform: function (notification) {
    //allow for fields filter
    if (notification.event) {
      notification.message = function () {
        if (NotificationsHelpers.eventTypes[this.event].messageFormat) {
          return NotificationsHelpers.eventTypes[this.event].messageFormat.apply(this)
        }
      }
      notification.metadata = NotificationsHelpers.eventTypes[notification.event].metadata
    }
    return notification
  }
});

//Minimum requirement for notifications to work while still providing 
//basic security. For added limitations use `Notifications.deny` in 
//your app.
Notifications.allow({
  insert: function(userId, doc){
    // new notifications can only be created via a Meteor method
    return false;
  },
  update: function (userId, doc) {
    return userId == doc.userId
  },
  remove: function (userId, doc) {
    return userId == doc.userId
  }
});

Meteor.methods({
  markAllNotificationsAsRead: function() {
    Notifications.update(
      {userId: Meteor.userId()},
      {
        $set:{
          read: true
        }
      },
      {multi: true}
    );
  }
});

//This is not stored in the notifications for dynamic updating
//for example if you change the metadata.emailTemplate it will
//continue to just work. 
NotificationsHelpers = {}
NotificationsHelpers.eventTypes = {}
NotificationsHelpers.addEventType = function (key, options) {
  //TODO: check for input sanity!
  
  if (NotificationsHelpers.eventTypes[key]) 
    throw new Error('Notifications: event type already exists!');

  NotificationsHelpers.eventTypes[key] = {}
  if (options) {
    NotificationsHelpers.eventTypes[key].messageFormat = options.message
    NotificationsHelpers.eventTypes[key].metadata = options.metadata
  }
}


if (Package['iron:router']) {
  routeSeenByUser = function () {
    //TODO: make this a method
    //TODO (possibly): allow for a disable overall and/or on a per user basis
    Notifications.find({url:this.path, read: false}, {fields: {read: 1}}).forEach(function (notification) {
      Notifications.update(notification._id, { $set: { read: true } })
    });
  }
  if (Router.onRun)
    Router.onRun(routeSeenByUser);
  else
    Router.load(routeSeenByUser);
};

