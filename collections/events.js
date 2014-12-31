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

    if (!!event.unique && !!Events.findOne({name: event.name})) {
      throw new Meteor.Error('// Event "' + event.name + '" already logged');
      return
    }

    event.createdAt = new Date();

    Events.insert(event);

  }
}