Events = new Mongo.Collection('events');

Events.schema = new SimpleSchema({
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
  },
  properties: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

Events.schema.internationalize();

Events.attachSchema(Events.schema);

if (Meteor.isServer) {
  Events.log = function (event) {

    // if event is supposed to be unique, check if it has already been logged
    if (!!event.unique && !!Events.findOne({name: event.name})) {
      return;
    }

    event.createdAt = new Date();

    Events.insert(event);

  };
}

Events.track = function(event, properties){
  // console.log('trackevent: ', event, properties);
  properties = properties || {};
  //TODO
  // add event to an Events collection for logging and buffering purposes
  if(Meteor.isClient){
    if(typeof mixpanel !== 'undefined' && typeof mixpanel.track !== 'undefined'){
      mixpanel.track(event, properties);
    }
    if(typeof GoSquared !== 'undefined' && typeof GoSquared.DefaultTracker !== 'undefined'){
      GoSquared.DefaultTracker.TrackEvent(event, JSON.stringify(properties));
    }
  }
};
