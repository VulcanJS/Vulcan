import { createCollection, getDefaultResolvers } from 'meteor/vulcan:core';
import schema from './schema.js';

const Events = createCollection({

  collectionName: 'Events',

  typeName: 'Event',

  schema,

  resolvers: getDefaultResolvers('Events'),

});

export default Events;
