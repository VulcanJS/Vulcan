// Reminders collection
import { createCollection } from 'meteor/vulcan:core';
import schema from './schema.js';
import resolvers from './resolvers.js';
import mutations from './mutations.js';
import './permissions.js';

const Reminders = createCollection({

  collectionName: 'reminders',

  typeName: 'Reminder',

  schema,

  resolvers,

  mutations,

});
