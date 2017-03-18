import SimpleSchema from 'simpl-schema';

const Events = new Mongo.Collection('events');

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

Events.attachSchema(Events.schema);

export default Events;
