import { GraphQLSchema } from 'meteor/vulcan:core';
// import Events from './collection.js';
import { requestAnalyticsAsync } from './helpers.js';

GraphQLSchema.addMutation('eventTrack(eventName: String, properties: JSON): JSON');

const resolvers = {
  Mutation: {
    eventTrack: (root, { eventName, properties }, context) => {
      const user = context.currentUser || {_id: 'anonymous'};
      
      requestAnalyticsAsync(eventName, properties, user);
      
      return properties;
    },
  },
};

GraphQLSchema.addResolvers(resolvers);
