var eventSchema = new SimpleSchema({
  createdAt: {
    type: Date
  },
  name: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  unique: {
    type: Boolean,
    optional: true
  },
  important: { // marking an event as important means it should never be erased
    type: Boolean,
    optional: true
  }
});


Events = new Meteor.Collection('events');
Events.attachSchema(eventSchema);

if (Meteor.isServer) {
  logEvent = function (event) {

    // if event is supposed to be unique, check if it has already been logged
    if (!!event.unique && !!Events.findOne({name: event.name})) {
      return
    }

    event.createdAt = new Date();

    Events.insert(event);

  }
}