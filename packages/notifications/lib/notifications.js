//This is our Global Object. 
Notifications = {
  //EventTypes allows us to add reusable logic that can be updated
  //without the need for migrations.
  //
  // messageFormat - a function that the package user defines, outputs a message string
  // metadata - useful data like template names that don't need to be in the database
  eventTypes: {},

  //add an event type
  addEventType: function (key, options) {
    check(key, String);
    check(options, Match.Optional(Object));

    if (Notifications.eventTypes[key]) 
      throw new Error('Notifications: event type already exists!');

    // Package users can define a predefined message from the notification instance.
    // It requires the user pass a options.message function or object.
    //
    // If its a function it will be run with the from the instance scope
    //
    // If its a string it will return a html from a template with the instance
    // as its data. 
    //
    // If its an object it will run run any number of templates or functions based on the optional
    // string argument given at the time of call. If no string is passed it will default 
    // to 'default'. From there it acts the same as ether of the above patterns.
    var message = function (template) {
      var message, messageFormat = Notifications.eventTypes[key].messageFormat

      if (_.isObject(messageFormat) && !_.isFunction(messageFormat) && !_.isString(messageFormat)) {
        if (messageFormat[template]) {
          message = messageFormat[template]
        } else {
          message = messageFormat.default
          if (!message) {
            throw new Meteor.Error('Notifications: No default message defined for "' + this.event + '" notifications');
          }
        }
      } 
      message = message || messageFormat

      if (_.isFunction(message)) {
        return message.apply(this) 
      } 

      else if (_.isString(message)) {
        return Blaze.toHTML(Blaze.With(this, function(){
          return Template[message]
        }));
      } 

      else {
        throw new Meteor.Error('Notifications: message not defined for "' + this.event + '" notifications');
      }
    }

    Notifications.eventTypes[key] = {
      message: message,
      messageFormat: options.message,
      metadata: options.metadata
    };
  }
};

//The collection and any instance functionality
Notifications.collection = new Meteor.Collection('notifications', {
  transform: function (notification) {
    if (notification.event) { //event may not be available if fields filter was called.

      //This is the basic message you want to output. Use in the app or as an email subject line
      // it is optional and is set up with createNotification from the server code.
      notification.message = function (template) {
        check(template, Match.Optional(String));
        if (Notifications.eventTypes[this.event].message) {
          //make the notification data accessible to the message function.
          return Notifications.eventTypes[this.event].message.call(this, template)
        };
      };

      //Load the current metadata, this will update with a hot-code-push.
      notification.metadata = Notifications.eventTypes[notification.event].metadata
    };
    return notification
  }
});

//Minimum requirement for notifications to work while still providing 
//basic security. For added limitations use `Notifications.deny` in 
//your app.
Notifications.collection.allow({
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


//literally mark-All-Notifications-As-Read, cheers :)
Meteor.methods({
  markAllNotificationsAsRead: function() {
    Notifications.collection.update(
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



//if iron route is prescient then do some fun routing magic
//basically if the user goes to a provided url, stored in the notification,
//then make the notification as read. Because its safe to assume they know about 
//what ever you were trying to tell them.
if (Package['iron:router']) { //your likely using the new packaging system if you have this code
  routeSeenByUser = function () {
    //TODO: make this a method
    //TODO (possibly): allow for disable overall and/or on a per user basis
    Notifications.collection.find({url:this.path, read: false}, {fields: {read: 1}}).forEach(function (notification) {
      Notifications.collection.update(notification._id, { $set: { read: true } })
    });
  }
  if (Router.onRun) //not sure when this changed so just to be safe
    Router.onRun(routeSeenByUser);
  else
    Router.load(routeSeenByUser);
};

